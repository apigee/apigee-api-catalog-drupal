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

namespace Drupal\apigee_asyncapi_doc\EventSubscriber;

use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Config\ConfigCrudEvent;
use Drupal\Core\Config\ConfigEvents;
use Drupal\views\Views;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Apigee AsyncAPI Doc event subscriber.
 */
class ApigeeAsyncapiDocSubscriber implements EventSubscriberInterface {

  /**
   * The messenger.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Constructs event subscriber.
   *
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger.
   */
  public function __construct(MessengerInterface $messenger) {
    $this->messenger = $messenger;
  }

  /**
   * Update views on installation.
   *
   * @param \Drupal\Core\Config\ConfigCrudEvent $event
   *   Config crud event.
   */
  public function configSave(ConfigCrudEvent $event) {
    $config = $event->getConfig();
    if ($config->getName() == 'core.entity_view_display.node.asyncapi_doc.default') {

      $view = Views::getView('apigee_api_catalog');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if ($filters['type']) {
          $filters['type']['value']['asyncapi_doc'] = 'asyncapi_doc';
        }
        if ($filters['type_1']) {
          $filters['type_1']['value']['asyncapi_doc'] = 'asyncapi_doc';
        }
        $view->display_handler->overrideOption('filters', $filters);

        $view->save();
        \Drupal::messenger()->addStatus('Updating Views - API Catalog view');
      }

      $view = Views::getView('api_catalog_admin');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if ($filters['type']) {
          $filters['type']['value']['asyncapi_doc'] = 'asyncapi_doc';
        }
        if ($filters['type_1']) {
          $filters['type_1']['value']['asyncapi_doc'] = 'asyncapi_doc';
        }
        $view->display_handler->overrideOption('filters', $filters);

        $view->save();
        \Drupal::messenger()->addStatus('Updating Views - API Catalog Admin');
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      ConfigEvents::SAVE => 'configSave',
    ];
  }

}
