<?php

namespace Drupal\apigee_graphql_doc;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleUninstallValidatorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Core\Url;
use Drupal\views\Views;

/**
 * Prevents uninstalling of module having content and reference in views
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

      // Restrict uninstall, if reference of graphql_doc is there in apigee_api_catalog view
      $view = Views::getView('apigee_api_catalog');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if (isset($filters['type']['value']['graphql_doc'])) {
          $message_arguments = [
            ':url' => Url::fromRoute('entity.view.edit_form', ['view' => 'apigee_api_catalog'])->toString(),
            '@label' => 'apigee_api_catalog',
          ];
          $reasons[] = $this->t('Please remove GraphQL Doc option from the view <a href=":url">@label</a>', $message_arguments);
        }
      }

      // Restrict uninstall, if reference of graphql_doc is there in api_catalog_admin view
      $view = Views::getView('api_catalog_admin');
      if (is_object($view)) {
        $display = $view->getDisplay();

        $filters = $view->display_handler->getOption('filters');
        if (isset($filters['type']['value']['graphql_doc'])) {
          $message_arguments = [
            ':url' => Url::fromRoute('entity.view.edit_form', ['view' => 'api_catalog_admin'])->toString(),
            '@label' => 'api_catalog_admin',
          ];
          $reasons[] = $this->t('Please remove GraphQL Doc option from the view <a href=":url">@label</a>', $message_arguments);
        }
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
