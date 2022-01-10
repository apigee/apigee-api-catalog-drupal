<?php

/**
 * @file
 * Copyright 2022 Google Inc.
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

namespace Drupal\apigee_async_doc;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleUninstallValidatorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Core\Url;
use Drupal\views\Views;

/**
 * Prevents uninstalling of module having content and reference in views.
 */
class ApigeeAsyncDocUninstallValidator implements ModuleUninstallValidatorInterface {

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
    if ($module == 'apigee_async_doc') {
      if ($this->hasAsyncDocNodes()) {
        $reasons[] = $this->t('To uninstall Apigee Async Doc, first delete all <em>Async Doc</em> content');
      }

      // Restrict uninstall, if reference of async_doc is there in apigee_api_catalog view.
      $view = Views::getView('apigee_api_catalog');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if (isset($filters['type']['value']['async_doc'])) {
          $message_arguments = [
            ':url' => Url::fromRoute('entity.view.edit_form', ['view' => 'apigee_api_catalog'])->toString(),
            '@label' => 'apigee_api_catalog',
          ];
          $reasons[] = $this->t('Please remove Async Doc option from the view <a href=":url">@label</a>', $message_arguments);
        }
      }

      // Restrict uninstall, if reference of async_doc is there in api_catalog_admin view.
      $view = Views::getView('api_catalog_admin');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if (isset($filters['type']['value']['async_doc'])) {
          $message_arguments = [
            ':url' => Url::fromRoute('entity.view.edit_form', ['view' => 'api_catalog_admin'])->toString(),
            '@label' => 'api_catalog_admin',
          ];
          $reasons[] = $this->t('Please remove Async Doc option from the view <a href=":url">@label</a>', $message_arguments);
        }
      }
    }

    return $reasons;
  }

  /**
   * Determines if there are any async_doc nodes or not.
   *
   * @return bool
   *   TRUE if there are forum nodes, FALSE otherwise.
   */
  protected function hasAsyncDocNodes() {
    $nodes = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'async_doc')
      ->accessCheck(FALSE)
      ->range(0, 1)
      ->execute();
    return !empty($nodes);
  }

}
