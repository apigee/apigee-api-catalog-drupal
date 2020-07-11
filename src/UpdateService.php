<?php

/*
 * Copyright 2020 Google Inc.
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

namespace Drupal\apigee_api_catalog;

use Drupal\Component\Serialization\Yaml;
use Drupal\Component\Uuid\UuidInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\EntityFieldManagerInterface;

/**
 * Class UpdateService.
 */
class UpdateService {

  /**
   * Drupal\Component\Uuid\UuidInterface definition.
   *
   * @var \Drupal\Component\Uuid\UuidInterface
   */
  protected $uuid;

  /**
   * Drupal\Core\Config\ConfigFactoryInterface definition.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Drupal\Core\Extension\ModuleHandlerInterface definition.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * Drupal\Core\Entity\EntityTypeManagerInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Drupal\Core\Entity\EntityFieldManagerInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;

  /**
   * Constructs a new UpdateService object.
   */
  public function __construct(UuidInterface $uuid, ConfigFactoryInterface $config_factory, ModuleHandlerInterface $module_handler, EntityTypeManagerInterface $entity_type_manager, EntityFieldManagerInterface $entity_field_manager) {
    $this->uuid = $uuid;
    $this->configFactory = $config_factory;
    $this->moduleHandler = $module_handler;
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFieldManager = $entity_field_manager;
  }

  /**
   * Create API Doc node type and fields.
   *
   * @return string
   *   A message to display.
   */
  public function update_8802() {
    $module = 'apigee_api_catalog';
    $configPath = drupal_get_path('module', $module) . '/config';
    $configToImport['install'] = [
      'node.type.apidoc',
      'core.base_field_override.node.apidoc.title',
      'field.field.node.apidoc.body',
      'core.entity_form_display.node.apidoc.default',
      'core.entity_view_display.node.apidoc.default',
    ];
    $fields = [
      'field_apidoc_spec_file_source',
      'field_apidoc_spec',
      'field_apidoc_file_link',
      'field_apidoc_spec_md5',
      'field_apidoc_api_product',
      'field_apidoc_fetched_timestamp',
    ];
    foreach ($fields as $field) {
      $configToImport['install'][] = 'field.storage.node.' . $field;
      $configToImport['install'][] = 'field.field.node.apidoc.' . $field;
    }
    if ($this->moduleHandler->moduleExists('views')) {
      $configToImport['optional'][] = 'views.view.api_catalog_admin';
      $configToImport['optional'][] = 'views.view.apigee_api_catalog';
    }

    foreach ($configToImport as $dir => $configs) {
      foreach ($configs as $config) {
        $raw = file_get_contents("$configPath/$dir/$config.yml");
        $data = Yaml::decode($raw);
        $this->configFactory
          ->getEditable($config)
          ->setData($data)
          ->set('uuid', $this->uuid->generate())
          ->save(TRUE);
      }
    }

    $this->entityTypeManager->clearCachedDefinitions();

    return 'Created API Doc node type and fields.';
  }

  /**
   * Recreate other fields added to the API Doc entity onto the API Doc node type.
   *
   * @return string
   *   A message to display.
   */
  public function update_8803() {
    /*
     * @todo:
     * - Get fields node apidoc bundle.
     * - Get fields on old apidoc entity (use \Drupal::entityDefinitionUpdateManager()?).
     * - Compare fields, try to recreate missing ones onto the node bundle.
     */
    $this->entityFieldManager->clearCachedFieldDefinitions();
    $fieldDefinitions = $this->entityFieldManager->getFieldDefinitions('node', 'apidoc');

    // Get the last known state of the API Doc entity type,
    // as it has now been removed from code.
    $entity_update_manager = \Drupal::entityDefinitionUpdateManager();
    $entity_type = $entity_update_manager->getEntityType('apidoc');
    // How to get the fields from the entity type?.

    return 'Recreated other fields added to the API Doc entity onto the API Doc node type.';
  }

  /**
   * Convert API Doc entities to nodes, migrating data.
   *
   * @param $sandbox
   *   The sandbox for batch operations.
   */
  public function update_8804(&$sandbox) {
    // @todo

    return 'Converted API Doc entities to nodes, migrating data.';
  }

  /**
   * Delete API Doc entity definition.
   */
  public function update_8805() {
    // Get the last known state of the API Doc entity type, as it has now been
    // removed from code.
    $entity_update_manager = \Drupal::entityDefinitionUpdateManager();
    $entity_type = $entity_update_manager->getEntityType('apidoc');
    $entity_update_manager->uninstallEntityType($entity_type);

    return 'The API Doc entity type has been removed from the system.';
  }

}
