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
use Drupal\Core\Config\FileStorage;
use Drupal\Core\Entity\EntityLastInstalledSchemaRepositoryInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Utility\UpdateException;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;

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
   * Drupal\Core\Entity\EntityLastInstalledSchemaRepositoryInterface definition.
   *
   * @var \Drupal\Core\Entity\EntityLastInstalledSchemaRepositoryInterface
   */
  protected $lastInstalledSchemaRepository;

  /**
   * Constructs a new UpdateService object.
   */
  public function __construct(UuidInterface $uuid,
                              ConfigFactoryInterface $config_factory,
                              ModuleHandlerInterface $module_handler,
                              EntityTypeManagerInterface $entity_type_manager,
                              EntityFieldManagerInterface $entity_field_manager,
                              EntityLastInstalledSchemaRepositoryInterface $last_installed_schema_repository) {
    $this->uuid = $uuid;
    $this->configFactory = $config_factory;
    $this->moduleHandler = $module_handler;
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFieldManager = $entity_field_manager;
    $this->lastInstalledSchemaRepository = $last_installed_schema_repository;
  }

  /**
   * Create API Doc node type and fields if updating from 1.x.
   *
   * @return string
   *   A message to display.
   */
  public function update8802() {
    $module = 'apigee_api_catalog';
    $configPath = \Drupal::service('extension.list.module')->getPath($module) . '/config';
    $configToImport['install'] = [
      'node.type.apidoc',
      'core.base_field_override.node.apidoc.title',
      'field.field.node.apidoc.body',
      'core.entity_form_display.node.apidoc.default',
      'core.entity_view_display.node.apidoc.default',
    ];
    if ($this->moduleHandler->moduleExists('views')) {
      $configToImport['optional'][] = 'views.view.api_catalog_admin';
      $configToImport['optional'][] = 'views.view.apigee_api_catalog';
    }

    foreach ($configToImport as $dir => $configs) {
      foreach ($configs as $config) {
        if (!$this->configFactory->listAll($config)) {
          $raw = file_get_contents("$configPath/$dir/$config.yml");
          $data = Yaml::decode($raw);
          $this->configFactory
            ->getEditable($config)
            ->setData($data)
            ->set('uuid', $this->uuid->generate())
            ->save(TRUE);
        }
      }
    }

    $fields = [
      'field_apidoc_spec_md5',
      'field_apidoc_fetched_timestamp',
      'field_apidoc_spec_file_source',
      'field_apidoc_spec',
      'field_apidoc_file_link',
    ];
    $source = new FileStorage("$configPath/install");
    foreach ($fields as $field) {

      if (!FieldStorageConfig::loadByName('node', $field)) {
        $contents = $source->read("field.storage.node.$field");

        // Somehow it doesn't take allowed_values...
        if ($field == 'field_apidoc_spec_file_source') {
          $contents['settings']['allowed_values'] = [];
        }

        $this->entityTypeManager->getStorage('field_storage_config')
          ->create($contents)
          ->save();
      }

      if (!FieldConfig::loadByName('node', 'apidoc', $field)) {
        $this->entityTypeManager->getStorage('field_config')
          ->create($source->read("field.field.node.apidoc.$field"))
          ->save();
      }
    }

    // Add back allowed_values to field_apidoc_spec_file_source.
    if ($field = FieldStorageConfig::loadByName('node', 'field_apidoc_spec_file_source')) {
      $field->setSetting('allowed_values', [
        'file' => 'File',
        'url' => 'URL',
      ])
        ->save();
    }

    $this->entityTypeManager->clearCachedDefinitions();

    return 'Created API Doc node type and fields.';
  }

  /**
   * Recreate other fields added to API Doc entity onto the API Doc node type.
   *
   * @return string
   *   A message to display.
   */
  public function update8803() {
    $this->entityFieldManager->clearCachedFieldDefinitions();
    $fieldStorageConfig = $this->entityTypeManager->getStorage('field_storage_config');
    $fieldConfig = $this->entityTypeManager->getStorage('field_config');

    // Get the last known state of the API Doc entity type.
    $apidocFieldDefs = $this->lastInstalledSchemaRepository->getLastInstalledFieldStorageDefinitions('apidoc');

    foreach ($apidocFieldDefs as $fieldName => $definition) {

      // Only look for field starting with "field_", as those were added
      // through the UI.
      if (substr($fieldName, 0, 6) === 'field_') {

        // Namespace this custom field to avoid collisions.
        // Machine names have a maximum length of 32 characters https://www.drupal.org/node/2232665
        $newFieldName = substr($fieldName . '_apidoc', 0, 32);

        if (!FieldStorageConfig::loadByName('node', $newFieldName)) {
          $fieldStorageConfig->create([
            'entity_type' => 'node',
            'field_name' => $newFieldName,
            'type' => $definition->getType(),
            'cardinality' => $definition->getCardinality(),
            'settings' => $definition->getSettings(),
            'label' => $definition->getLabel(),
          ])->save();
        }

        if (!FieldConfig::loadByName('node', 'apidoc', $newFieldName)) {
          $fieldConfig->create([
            'field_name' => $newFieldName,
            'entity_type' => 'node',
            'bundle' => 'apidoc',
            'label' => $definition->getLabel(),
            'description' => $definition->getDescription(),
            'settings' => $definition->getSettings(),
          ])->save();
        }

        $this->addToFieldMap($fieldName, $newFieldName);
      }
    }

    return 'Recreated custom fields (if any) added to the API Doc entity onto the API Doc node type.';
  }

  /**
   * Convert API Doc entities to nodes, migrating data.
   *
   * @param array|null $sandbox
   *   The sandbox for batch operations.
   */
  public function update8804(&$sandbox) {
    // If 1.x was never installed, there is no apidoc entity saved previously.
    $entity_update_manager = \Drupal::entityDefinitionUpdateManager();
    if (!$entity_update_manager->getEntityType('apidoc')) {
      $sandbox['#finished'] = 1;

      return 'No API Doc entities found, no data migration needed.';
    }

    $fieldMap = $this->getFieldMap();
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $apidocStorage = $this->entityTypeManager->getStorage('apidoc');

    if (!isset($sandbox['progress'])) {
      $query = $apidocStorage->getQuery()->accessCheck(FALSE);
      $total = $query->count()->execute();

      $sandbox['progress'] = 0;
      $sandbox['total'] = $total;
    }

    if (empty($sandbox['total'])) {
      $sandbox['#finished'] = 1;

      return 'No API Doc entities found, no data migration needed.';
    }

    // Migrate in chunks of 20.
    $query = $apidocStorage->getQuery()
      ->accessCheck(FALSE)
      ->sort('id')
      ->range($sandbox['progress'], 20);
    $ids = $query->execute();

    $apidocs = $apidocStorage->loadMultiple($ids);
    foreach ($apidocs as $apidoc) {
      $values = [
        'type' => 'apidoc',
        'title' => $apidoc->label(),
        'body' => [
          'value' => $apidoc->description->value,
          'format' => 'full_html',
        ],
        'status' => $apidoc->status->value,
        'created' => $apidoc->created->value,
        'changed' => $apidoc->changed->value,
        'field_apidoc_spec_file_source' => $apidoc->spec_file_source->value,
        'field_apidoc_spec_md5' => $apidoc->spec_md5->value,
        'field_apidoc_fetched_timestamp' => $apidoc->fetched_timestamp->value,
        'field_apidoc_spec' => $apidoc->spec->getValue(),
        'field_apidoc_file_link' => $apidoc->file_link->getValue(),
      ];
      foreach ($fieldMap as $old => $new) {
        $values[$new] = $apidoc->{$old}->getValue();
      }

      $node = $nodeStorage->create($values);
      $node->save();

      $apidoc->delete();

      $sandbox['progress']++;
    }

    $sandbox['#finished'] = $sandbox['progress'] / $sandbox['total'];

    return 'Converted API Doc entities to nodes, migrating data.';
  }

  /**
   * Delete API Doc entity definition.
   */
  public function update8805() {
    // Get the last known state of the API Doc entity type.
    $entity_update_manager = \Drupal::entityDefinitionUpdateManager();
    if ($entity_type = $entity_update_manager->getEntityType('apidoc')) {
      $entity_update_manager->uninstallEntityType($entity_type);

      // Clear all caches.
      drupal_flush_all_caches();
    }

    return 'The API Doc deprecated entity type has been removed from the system.';
  }

  /**
   * Recreate API Doc entity definition.
   *
   * Rollback update8805().
   */
  public function update8806() {
    \Drupal::entityTypeManager()->clearCachedDefinitions();
    $entity_definition_update_manager = \Drupal::entityDefinitionUpdateManager();
    $entity_definition_update_manager->installEntityType(\Drupal::entityTypeManager()->getDefinition('apidoc'));

    // Clear all caches.
    drupal_flush_all_caches();

    return 'Installed API Doc deprecated entity type.';
  }

  /**
   * This will set the field field_apidoc_spec_file_source as not required.
   */
  public function update8807() {
    $field = FieldConfig::loadByName('node', 'apidoc', 'field_apidoc_spec_file_source');
    $field->set('required', FALSE)
      ->save();

    // Clear all caches.
    drupal_flush_all_caches();

    return 'Updated field_apidoc_spec_file_source required attribute to false.';
  }

  /**
   * This will add the field API Product.
   */
  public function update8808() {
    $module = 'apigee_api_catalog';
    $configPath = \Drupal::service('extension.list.module')->getPath($module) . '/config';
    $configToImport['install'] = [
      'node.type.apidoc',
      'field.field.node.apidoc.field_api_product',
      'core.entity_form_display.node.apidoc.default',
      'core.entity_view_display.node.apidoc.default',
    ];
    if (!$this->moduleHandler->moduleExists('apigee_edge')) {
      throw new UpdateException('Apigee Edge is required to add API Product field, install the Apigee Edge and update again.');
    }

    foreach ($configToImport as $dir => $configs) {
      foreach ($configs as $config) {
        if (!$this->configFactory->listAll($config)) {
          $raw = file_get_contents("$configPath/$dir/$config.yml");
          $data = Yaml::decode($raw);
          $this->configFactory
            ->getEditable($config)
            ->setData($data)
            ->set('uuid', $this->uuid->generate())
            ->save(TRUE);
        }
      }
    }

    $fields = [
      'field_api_product',
    ];
    $source = new FileStorage("$configPath/install");
    foreach ($fields as $field) {

      if (!FieldStorageConfig::loadByName('node', $field)) {
        $contents = $source->read("field.storage.node.$field");

        $this->entityTypeManager->getStorage('field_storage_config')
          ->create($contents)
          ->save();
      }

      if (!FieldConfig::loadByName('node', 'apidoc', $field)) {
        $this->entityTypeManager->getStorage('field_config')
          ->create($source->read("field.field.node.apidoc.$field"))
          ->save();
      }
    }

    // Display field_api_product on the form display.
    \Drupal::entityTypeManager()
      ->getStorage('entity_form_display')
      ->load('node.apidoc.default')
      ->setComponent('field_api_product', ['weight' => 7])
      ->save();

    $this->entityTypeManager->clearCachedDefinitions();

    return 'Added API Product field for apidoc.';

  }

  /**
   * Rename API Doc content type as OpenAPI Doc.
   */
  public function update8809() {
    // Display field_api_product on the form display.
    \Drupal::entityTypeManager()
      ->getStorage('node_type')
      ->load('apidoc')
      ->set('name', 'OpenAPI Doc')
      ->set('description', 'Use <em>OpenAPI Docs</em> to document OpenAPIs')
      ->save();
  }

  /**
   * Removed .yml file upload for security reasons.
   */
  public function update8810() {
    $fields = [
      'field_apidoc_file_link',
      'field_apidoc_spec',
    ];

    foreach ($fields as $field) {
      $fieldConfig = FieldConfig::loadByName('node', 'apidoc', $field);
      // Only look for yml extension.
      $extensions = $fieldConfig->getSetting('file_extensions');
      if (strpos($extensions, 'yml') !== FALSE) {
        // Remove yml extension from allowed values.
        $fieldConfig->setSetting('file_extensions', 'yaml json')
          ->save();
      }
    }

    return 'Removed the yml extension from field_apidoc_file_link and field_apidoc_spec allowed values for security reasons.';
  }

  /**
   * Get the field map from apidoc fields to node fields.
   *
   * @return array
   *   The field mapping.
   */
  protected function getFieldMap(): array {
    $map = \Drupal::state()->get('apigee_api_catalog_update_8803_fieldmap', []);

    return $map;
  }

  /**
   * Add a field to the field map.
   *
   * @param string $old
   *   The apidoc field name.
   * @param string $new
   *   The node field name.
   */
  protected function addToFieldMap(string $old, string $new) {
    $map = $this->getFieldMap();
    $map[$old] = $new;
    \Drupal::state()->set('apigee_api_catalog_update_8803_fieldmap', $map);
  }

}
