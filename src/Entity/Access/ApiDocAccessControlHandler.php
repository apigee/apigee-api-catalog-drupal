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

namespace Drupal\apigee_api_catalog\Entity\Access;

use Drupal\apigee_api_catalog\Entity\ApiDocInterface;
use Drupal\apigee_api_catalog\Entity\Form\ApiDocSettingsForm;
use Drupal\apigee_edge\Entity\ApiProduct;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityHandlerInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Access controller for the API Doc entity.
 *
 * @see \Drupal\apigee_api_catalog\Entity\ApiDoc.
 */
class ApiDocAccessControlHandler extends EntityAccessControlHandler implements EntityHandlerInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $config;

  /**
   * Constructs an access control handler instance.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config
   *   The config factory.
   */
  public function __construct(EntityTypeInterface $entity_type, EntityTypeManagerInterface $entityTypeManager, ConfigFactoryInterface $config) {
    parent::__construct($entity_type);
    $this->entityTypeManager = $entityTypeManager;
    $this->config = $config;
  }

  /**
   * {@inheritdoc}
   */
  public static function createInstance(ContainerInterface $container, EntityTypeInterface $entity_type) {
    return new static(
      $entity_type,
      $container->get('entity_type.manager'),
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\apigee_api_catalog\Entity\ApiDocInterface $entity */
    $access = parent::checkAccess($entity, $operation, $account);

    // Access control for revisions.
    if (!$entity->isDefaultRevision()) {
      return $this->checkAccessRevisions($entity, $operation, $account);
    }

    switch ($operation) {
      case 'view':
        $access = $access->orIf($entity->isPublished()
          ? AccessResult::allowedIfHasPermission($account, 'view published apidoc entities')
          : AccessResult::allowedIfHasPermission($account, 'view unpublished apidoc entities')
        );
        // Get the global config for access control.
        $product_access_scheme = $this->config->get(ApiDocSettingsForm::CONFIG_NAME)->get('enable_product_access_control');
        // We enforce product access globally or if set on this `apidoc` entity.
        if ($product_access_scheme === 'always' || ($product_access_scheme === 'configurable' && $entity->product_access_control->value === "1")) {
          // Get the associated API Product.
          $api_product_entity = $entity->api_product->value;
          // Only allow if the product has been set.
          $access = $access->andIf(AccessResult::allowedIf($api_product_entity instanceof ApiProduct));
          if ($access->isAllowed()) {
            // Check the API product for access as well.
            $access = $access->andIf($api_product_entity->access($operation, $account));
          }

          // Editors and administrators will need access to set the product.
          $access = $access->orIf($entity->access('update', $account, TRUE));
        }

        return $access;

      case 'reimport':
        return AccessResult::allowedIf($entity->spec_file_source->value === ApiDocInterface::SPEC_AS_URL)
          ->andIf($entity->access('update', $account, TRUE));

      case 'update':
        return $access->orIf(AccessResult::allowedIfHasPermission($account, 'edit apidoc entities'));

      case 'delete':
        return $access->orIf(AccessResult::allowedIfHasPermission($account, 'delete apidoc entities'));
    }

    // Unknown operation, no opinion.
    return $access;
  }

  /**
   * Additional access control for revisions.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity for which to check access.
   * @param string $operation
   *   The entity operation.
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user for which to check access.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
  protected function checkAccessRevisions(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\Core\Entity\EntityStorageInterface $entity_storage */
    $entity_storage = $this->entityTypeManager->getStorage($this->entityTypeId);

    // Must have access to the same operation on the default revision.
    $default_revision = $entity_storage->load($entity->id());
    $has_default_entity_rev_access = $default_revision->access($operation, $account);
    if (!$has_default_entity_rev_access) {
      return AccessResult::forbidden();
    }

    $map = [
      'view' => "view apidoc revisions",
      'update' => "revert apidoc revisions",
    ];

    if (!$entity || !isset($map[$operation])) {
      // If there was no entity to check against, or the $op was not one of the
      // supported ones, we return access denied.
      return AccessResult::forbidden();
    }

    $admin_permission = $this->entityType->getAdminPermission();

    // Perform basic permission checks first.
    if ($account->hasPermission($map[$operation]) ||
      ($admin_permission && $account->hasPermission($admin_permission))) {
      return AccessResult::allowed();
    }

    return AccessResult::forbidden();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add apidoc entities')
      ->orIf(AccessResult::allowedIfHasPermission($account, 'administer apigee api catalog'));
  }

}
