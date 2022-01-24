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

namespace Drupal\apigee_graphql_doc;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleUninstallValidatorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Core\Url;
use Drupal\views\Views;

/**
 * Prevents uninstalling of module having content and reference in views.
 */
class ApigeeGraphqlDocUninstallValidator implements ModuleUninstallValidatorInterface {

  use StringTranslationTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new FilterUninstallValidator.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_manager
   *   The entity manager.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $string_translation
   *   The string translation service.
   */
  public function __construct(EntityTypeManagerInterface $entity_manager, TranslationInterface $string_translation) {
    $this->entityTypeManager = $entity_manager;
    $this->stringTranslation = $string_translation;
  }

  /**
   * {@inheritdoc}
   */
  public function validate($module) {
    $reasons = [];
    if ($module == 'apigee_graphql_doc') {
      if ($this->hasGraphqlDocNodes()) {
        $reasons[] = $this->t('To uninstall Apigee GraphQL Doc, first delete all <em>GraphQL Doc</em> content');
      }

      // Restrict uninstall, if reference of graphql_doc is there in apigee_api_catalog view.
      $is_views_references = FALSE;
      $view = Views::getView('apigee_api_catalog');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if (isset($filters['type']['value']['graphql_doc'])) {
          $is_views_references = TRUE;
        }
      }

      // Restrict uninstall, if reference of graphql_doc is there in api_catalog_admin view.
      $view = Views::getView('api_catalog_admin');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if (isset($filters['type']['value']['graphql_doc'])) {
          $is_views_references = TRUE;
        }
      }
      if ($is_views_references) {
        $message_arguments = [
          ':url' => Url::fromRoute('apigee_graphql_doc.remove_views_references')->toString(),
        ];
        $reasons[] = $this->t('Please <a href=":url">remove GraphQL Doc references</a> from both "apigee_api_catalog" and "api_catalog_admin" views', $message_arguments);
      }
    }

    return $reasons;
  }

  /**
   * Determines if there are any graphql_doc nodes or not.
   *
   * @return bool
   *   TRUE if there are forum nodes, FALSE otherwise.
   */
  protected function hasGraphqlDocNodes() {
    $nodes = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'graphql_doc')
      ->accessCheck(FALSE)
      ->range(0, 1)
      ->execute();
    return !empty($nodes);
  }

}
