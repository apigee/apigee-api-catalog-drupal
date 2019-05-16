<?php

/**
 * Copyright 2018 Google Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License version 2 as published by the
 * Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
 * License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

namespace Drupal\apigee_api_catalog\Plugin\Field\FieldFormatter;

use Drupal\Component\Serialization\Exception\InvalidDataTypeException;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Serialization\Yaml;
use Drupal\file\Plugin\Field\FieldFormatter\FileFormatterBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Component\Serialization\Json;

/**
 * Plugin implementation of the SmartDocs OpenAPI spec formatter.
 *
 * @FieldFormatter(
 *   id = "apigee_api_catalog_smartdocs",
 *   label = @Translation("SmartDocs"),
 *   description = @Translation("Formats OpenAPI specs with SmartDocs"),
 *   field_types = {
 *     "file"
 *   }
 * )
 */
class SmartDocsFormatter extends FileFormatterBase implements ContainerFactoryPluginInterface {

  /**
   * The logger factory.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * Constructs a EntityReferenceEntityFormatter instance.
   *
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the formatter is associated.
   * @param array $settings
   *   The formatter settings.
   * @param string $label
   *   The formatter label display setting.
   * @param string $view_mode
   *   The view mode.
   * @param array $third_party_settings
   *   Any third party settings settings.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $loggerFactory
   *   The logger factory.
   */
  public function __construct($plugin_id, $plugin_definition, FieldDefinitionInterface $field_definition, array $settings, $label, $view_mode, array $third_party_settings, LoggerChannelFactoryInterface $loggerFactory) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $label, $view_mode, $third_party_settings);
    $this->loggerFactory = $loggerFactory->get('apigee_api_catalog');;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $container->get('logger.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function view(FieldItemListInterface $items, $langcode = NULL) {
    $elements = parent::view($items, $langcode);

    $entity = $items->getEntity();
    $entity_type = $entity->getEntityTypeId();

    $openapi_files = [];

    /** @var \Drupal\file\Entity\File $file */
    foreach ($this->getEntitiesToView($items, $langcode) as $delta => $file) {
      $openapi_file_urls[] = file_create_url($file->getFileUri());
      $extension = end(explode(".", $file->getFilename()));
      $file_data = file_get_contents($file->getFileUri());
      if ($extension == 'json') {
        $spec = Json::decode($file_data);

        if (!$spec) {
          $this->loggerFactory->error('Error parsing JSON file ' . $file->getFilename());
          $this->messenger()->addError($this->t('Error parsing JSON file %filename.', [
            '%filename' => $file->getFilename(),
          ]));
          continue;
        }
      }
      else {
        try {
          $spec = Yaml::decode($file_data);
        }
        catch (InvalidDataTypeException $e) {
          $this->loggerFactory->error('Error parsing Yaml file ' . $file->getFilename() . ': ' . $e->getMessage());
          $this->messenger()->addError($this->t('Error parsing Yaml file %filename: %error', [
            '%filename' => $file->getFilename(),
            '%error' => $e->getMessage(),
          ]));
          continue;
        }
      }
      $openapi_files[] = $spec;
    }

    $elements['#attached'] = [
      'library' => [
        'apigee_api_catalog/apigee_api_catalog.smartdocs',
        'apigee_api_catalog/apigee_api_catalog.smartdocs_integration',
      ],
    ];

    $elements['#attached']['drupalSettings']['smartdocsFieldFormatter'][$this->fieldDefinition->getName()] = [
      'openApiFileUrls' => $openapi_file_urls,
      'openApiFiles' => $openapi_files,
      'entityId' => $entity->id(),
      'entityType' => $entity_type,
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        // Render out tags for SmartDocs Angular app.
        // See theme_html_tag().
        '#type' => 'html_tag',
        '#tag' => 'app-root',
        '#value' => $this->t('Loading...'),
      ];
    }

    return $elements;
  }

}
