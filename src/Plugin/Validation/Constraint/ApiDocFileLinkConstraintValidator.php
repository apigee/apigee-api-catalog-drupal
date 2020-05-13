<?php

/**
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

namespace Drupal\apigee_api_catalog\Plugin\Validation\Constraint;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Url;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Class ApiDocFileLinkConstraintValidator.
 */
class ApiDocFileLinkConstraintValidator extends ConstraintValidator implements ContainerInjectionInterface {

  /**
   * The HTTP client to fetch the files with.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * ApiDocFileLinkConstraintValidator constructor.
   *
   * @param \GuzzleHttp\ClientInterface $http_client
   *   A Guzzle client object.
   */
  public function __construct(ClientInterface $http_client) {
    $this->httpClient = $http_client;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('http_client'));
  }

  /**
   * {@inheritdoc}
   */
  public function validate($items, Constraint $constraint) {
    /** @var \Drupal\Core\Field\FieldItemListInterface $items */
    if (!isset($items)) {
      return;
    }

    foreach ($items as $item) {
      if ($item->isEmpty()) {
        continue;
      }

      // Try to resolve the given URI to a URL. It may fail if it's scheme-less.
      try {
        $url = Url::fromUri($item->getValue()['uri'], ['absolute' => TRUE])->toString();
      }
      catch (\InvalidArgumentException $e) {
        $this->context->addViolation($constraint->urlParseError, ['@error' => $e->getMessage()]);
        return;
      }

      try {
        $options = [
          'allow_redirects' => [
            'strict' => TRUE,
          ],
        ];

        // Perform only a HEAD method to save bandwidth.
        /* @var $response \Psr\Http\Message\ResponseInterface */
        $response = $this->httpClient->head($url, $options);
      }
      catch (RequestException $request_exception) {
        $this->context->addViolation($constraint->notValid, [
          '%value' => $url,
        ]);
      }
    }
  }

}
