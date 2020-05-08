<?php

/*
 * Copyright 2019 Google Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 */

namespace Drupal\apigee_api_catalog;

use Drupal\Component\Datetime\DateTimePlus;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Psr7\Request;
use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

/**
 * Class SpecFetcher.
 */
class SpecFetcher implements SpecFetcherInterface {

  use StringTranslationTrait;
  use MessengerTrait;

  /**
   * Drupal\Core\File\FileSystemInterface definition.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected $fileSystem;

  /**
   * GuzzleHttp\ClientInterface definition.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The logger.
   *
   * @var \Psr\Log\LoggerInterface
   */
  private $logger;

  /**
   * Constructs a new SpecFetcher.
   *
   * @param \Drupal\Core\File\FileSystemInterface $file_system
   *   The file_system service.
   * @param \GuzzleHttp\ClientInterface $http_client
   *   The http_client service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $translation
   *   The string translation.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger service.
   * @param \Psr\Log\LoggerInterface $logger
   *   The logger service.
   */
  public function __construct(FileSystemInterface $file_system, ClientInterface $http_client, EntityTypeManagerInterface $entityTypeManager, TranslationInterface $translation, MessengerInterface $messenger, LoggerInterface $logger) {
    $this->fileSystem = $file_system;
    $this->httpClient = $http_client;
    $this->entityTypeManager = $entityTypeManager;
    $this->stringTranslation = $translation;
    $this->messenger = $messenger;
    $this->logger = $logger;
  }

  /**
   * {@inheritdoc}
   */
  public function fetchSpec(NodeInterface $apidoc): string {
    $spec_value = $apidoc->get('field_apidoc_spec')->isEmpty() ? [] : $apidoc->get('field_apidoc_spec')->getValue()[0];

    // If "spec_file_source" uses URL, grab file from "file_link" and save it
    // into the "spec" file field. The file_link field should already have
    // validated that a valid file exists at that URL.
    if ($apidoc->get('field_apidoc_spec_file_source')->value === static::SPEC_AS_URL) {

      // If the file_link field is empty, return without changes.
      // TODO: The file link shouldn't be empty. Consider throwing an error.
      if ($apidoc->get('field_apidoc_file_link')->isEmpty()) {
        return FALSE;
      }

      $source_uri = $apidoc->get('field_apidoc_file_link')->getValue()[0]['uri'];
      $source_uri = Url::fromUri($source_uri, ['absolute' => TRUE])->toString();
      $request = new Request('GET', $source_uri);
      $options = [
        'exceptions' => TRUE,
        'allow_redirects' => [
          'strict' => TRUE,
        ],
      ];

      // Generate conditional GET header.
      if (!$apidoc->get('field_apidoc_fetched_timestamp')->isEmpty()) {
        $request = $request->withAddedHeader('If-Modified-Since', gmdate(DateTimePlus::RFC7231, $apidoc->get('field_apidoc_fetched_timestamp')->value));
      }

      try {
        $response = $this->httpClient->send($request, $options);
      }
      catch (GuzzleException $e) {
        $this->log(LogLevel::ERROR, 'API Doc %label: Could not retrieve OpenAPI specification file located at %url.', [
          '%url' => $source_uri,
          '%label' => $apidoc->label(),
        ]);
        return self::STATUS_ERROR;
      }

      // In case of a 304 Not Modified there are no changes, but update
      // last fetched timestamp.
      if ($response->getStatusCode() === 304) {
        $apidoc->set('field_apidoc_fetched_timestamp', time());
        return self::STATUS_UNCHANGED;
      }

      $data = (string) $response->getBody();
      if (($file_size = $response->getBody()->getSize()) && $file_size < 1) {
        $this->log(LogLevel::ERROR, 'API Doc %label: OpenAPI specification file located at %url is empty.', [
          '%url' => $source_uri,
          '%label' => $apidoc->label(),
        ]);
        return self::STATUS_ERROR;
      }

      // Only save file if it hasn't been fetched previously.
      $data_md5 = md5($data);
      $prev_md5 = $apidoc->get('field_apidoc_spec_md5')->isEmpty() ? NULL : $apidoc->get('field_apidoc_spec_md5')->value;
      if ($prev_md5 == $data_md5) {
        // Files are the same, only update fetched timestamp.
        $apidoc->set('field_apidoc_fetched_timestamp', time());
        return self::STATUS_UNCHANGED;
      }
      else {
        $filename = $this->fileSystem->basename($source_uri);
        $specs_definition = $apidoc->getFieldDefinition('field_apidoc_spec')->getItemDefinition();
        $target_dir = $specs_definition->getSetting('file_directory');
        $uri_scheme = $specs_definition->getSetting('uri_scheme');
        $destination = "$uri_scheme://$target_dir/";

        try {
          $this->checkRequirements($destination);
          $file = file_save_data($data, $destination . $filename, FileSystemInterface::EXISTS_RENAME);

          if (empty($file)) {
            throw new \Exception('Could not save API Doc specification file.');
          }
        }
        catch (\Exception $e) {
          $this->log(LogLevel::ERROR, 'Error while saving API Doc spec file from URL on API Doc ID: %id. Error: %error', [
            '%id' => $apidoc->id(),
            '%error' => $e->getMessage(),
          ]);
          return self::STATUS_ERROR;
        }

        $spec_value = ['target_id' => $file->id()] + $spec_value;
        $apidoc->set('field_apidoc_spec', $spec_value);
        $apidoc->set('field_apidoc_spec_md5', $data_md5);
        $apidoc->set('field_apidoc_fetched_timestamp', time());

        return self::STATUS_UPDATED;
      }
    }

    return self::STATUS_UNCHANGED;
  }

  /**
   * Log a message, and optionally display it on the UI.
   *
   * @param string $level
   *   The Error level.
   * @param string $message
   *   The message.
   * @param array $params
   *   Optional parameters array.
   */
  private function log(string $level, string $message, array $params = []) {
    $this->logger->log($level, $message, $params);
    // Show the message.
    $this->messenger()->addMessage($this->t($message, $params), static::LOG_LEVEL_MAP[$level] ?? MessengerInterface::TYPE_ERROR);
  }

  /**
   * Checks requirements for saving of a file spec.
   *
   * If a requirement is not fulfilled it throws an exception.
   *
   * @param string $destination
   *   The specification file destination directory, including scheme.
   *
   * @throws \Exception
   */
  private function checkRequirements(string $destination): void {
    // If using private filesystem, check that it's been configured.
    if (strpos($destination, 'private://') === 0 && !$this->isPrivateFileSystemConfigured()) {
      throw new \Exception('Private filesystem has not been configured.');
    }

    if (!$this->fileSystem->prepareDirectory($destination, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS)) {
      throw new \Exception('Could not prepare API Doc specification file destination directory.');
    }
  }

  /**
   * Checks whether the private filesystem is configured.
   *
   * @return bool
   *   True if configured, FALSE otherwise.
   */
  private function isPrivateFileSystemConfigured(): bool {
    return (bool) $this->fileSystem->realpath('private://');
  }

}
