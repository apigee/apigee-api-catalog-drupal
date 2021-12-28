<?php

namespace Drupal\apigee_graphql_doc\EventSubscriber;

use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Config\ConfigCrudEvent;
use Drupal\Core\Config\ConfigEvents;
use Drupal\views\Views;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Apigee GraphQL Doc event subscriber.
 */
class ApigeeGraphqlDocSubscriber implements EventSubscriberInterface {

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
    if ($config->getName() == 'core.entity_view_display.node.graphql_doc.default') {

      $view = Views::getView('apigee_api_catalog');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if ($filters['type']) {
          $filters['type']['value']['graphql_doc'] = 'graphql_doc';
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
          $filters['type']['value']['graphql_doc'] = 'graphql_doc';
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
