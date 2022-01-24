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

namespace Drupal\apigee_graphql_doc\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\views\Views;

/**
 * Returns responses for Apigee GraphQL Doc routes.
 */
class ApigeeGraphqlDocController extends ControllerBase {

  /**
   * Remove_views_references, before uninstall.
   */
  public function remove_views_references() {

    $view = Views::getView('apigee_api_catalog');
    if (is_object($view)) {
      $display = $view->getDisplay();

      $filters = $view->display_handler->getOption('filters');
      if ($filters['type']['value']['graphql_doc']) {
        unset($filters['type']['value']['graphql_doc']);
      }
      if ($filters['type_1'] && $filters['type_1']['value']['graphql_doc']) {
        unset($filters['type_1']['value']['graphql_doc']);
      }
      $view->display_handler->overrideOption('filters', $filters);

      $view->save();

      \Drupal::messenger()->addStatus('Updating Views - API Catalog');
    }

    $view = Views::getView('api_catalog_admin');
    if (is_object($view)) {
      $display = $view->getDisplay();

      $filters = $view->display_handler->getOption('filters');
      if ($filters['type']['value']['graphql_doc']) {
        unset($filters['type']['value']['graphql_doc']);
      }
      $view->display_handler->overrideOption('filters', $filters);

      $view->save();

      \Drupal::messenger()->addStatus('Updating Views - API Catalog Admin');
    }

    return $this->redirect('system.modules_uninstall');
  }

}
