<?php

/**
 * @file
 * Copyright 2021 Google Inc.
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

namespace Drupal\apigee_graphql_doc\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;

/**
 * Plugin implementation of the 'Graphql' formatter.
 *
 * @FieldFormatter(
 *   id = "apigee_graphql_doc_graphql",
 *   label = @Translation("GraphQL"),
 *   field_types = {
 *     "file_link"
 *   }
 * )
 */
class GraphqlFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = [];

    foreach ($items as $delta => $item) {
      $element[$delta] = [
        '#theme' => 'apigee_graphql_doc_file_link_field_item',
        '#field_name' => $this->fieldDefinition->getName(),
        '#delta' => $delta,
      ];
    }

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function view(FieldItemListInterface $items, $langcode = NULL) {
    $element = parent::view($items, $langcode);

    $graphql_urls = [];
    foreach ($items as $delta => $item) {
      /** @var \Drupal\link\Plugin\Field\FieldType\LinkItem $item */
      // Not validating URLs or paths.
      $graphql_urls[] = $item->getUrl()->toString();
    }

    return $this->attachLibraries($element, $graphql_urls);
  }

  /**
   * Helper function to attach library definitions and pass JavaScript settings.
   *
   * @param array $element
   *   A renderable array of the field element.
   * @param array $graphql_urls
   *   An array of GraphQL Urls.
   *
   * @return array
   *   A renderable array of the field element with attached libraries.
   */
  private function attachLibraries(array $element, array $graphql_urls) {
    if (!empty($graphql_urls)) {
      $element['#attached'] = [
        'library' => [
          'apigee_graphql_doc/reactjs',
          'apigee_graphql_doc/graphiql',
          'apigee_graphql_doc/apigee_graphql_doc_integration',
        ],
        'drupalSettings' => [
          'apigeeGraphqlDocFormatter' => [
            $this->fieldDefinition->getName() => [
              'graphqlUrls' => $graphql_urls,
            ]
          ]
        ]
      ];
    }
    return $element;
  }

}
