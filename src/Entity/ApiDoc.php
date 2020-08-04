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

namespace Drupal\apigee_api_catalog\Entity;

use Drupal\apigee_api_catalog\Entity\Form\ApiDocSettingsForm;
use Drupal\Core\Entity\EditorialContentEntityBase;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\link\LinkItemInterface;

/**
 * Defines the API Doc entity.
 *
 * @deprecated in 2.x and is removed from 3.x. Use the node "apidoc" bundle instead.
 * @see https://github.com/apigee/apigee-api-catalog-drupal/pull/84
 *
 * @ContentEntityType(
 *   id = "apidoc",
 *   label = @Translation("API Doc"),
 *   label_singular = @Translation("API Doc"),
 *   label_plural = @Translation("API Docs"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "translation" = "Drupal\content_translation\ContentTranslationHandler",
 *     "access" = "Drupal\apigee_api_catalog\Entity\Access\ApiDocAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\apigee_api_catalog\Entity\Routing\ApiDocHtmlRouteProvider",
 *       "revision" = "Drupal\entity\Routing\RevisionRouteProvider",
 *     },
 *   },
 *   base_table = "apidoc",
 *   data_table = "apidoc_field_data",
 *   revision_table = "apidoc_revision",
 *   revision_data_table = "apidoc_field_revision",
 *   show_revision_ui = FALSE,
 *   translatable = TRUE,
 *   admin_permission = "administer apigee api catalog",
 *   internal = TRUE,
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "langcode" = "langcode",
 *     "published" = "status",
 *     "revision" = "revision_id",
 *   },
 *   revision_metadata_keys = {
 *     "revision_user" = "revision_user",
 *     "revision_created" = "revision_created",
 *     "revision_log_message" = "revision_log_message",
 *   },
 *   links = {
 *     "canonical" = "/api/{apidoc}",
 *     "add-form" = "/admin/content/api/add",
 *     "edit-form" = "/admin/content/api/{apidoc}/edit",
 *     "delete-form" = "/admin/content/api/{apidoc}/delete",
 *     "reimport-spec-form" = "/admin/content/api/{apidoc}/reimport",
 *     "version-history" = "/admin/content/api/{apidoc}/revisions",
 *     "revision" = "/admin/content/api/{apidoc}/revisions/{apidoc_revision}/view",
 *     "revision-revert-form" = "/admin/content/api/{apidoc}/revisions/{apidoc_revision}/revert",
 *     "collection" = "/admin/content/apis",
 *   },
 *   field_ui_base_route = "entity.apidoc.settings"
 * )
 */
class ApiDoc extends EditorialContentEntityBase implements ApiDocInterface {

  use EntityChangedTrait;

  /**
   * {@inheritdoc}
   */
  public function getName(): string {
    return $this->get('name')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setName(string $name): ApiDocInterface {
    $this->set('name', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription(): string {
    return $this->get('description')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setDescription(string $description): ApiDocInterface {
    $this->set('description', $description);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime(): int {
    return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime(int $timestamp): ApiDocInterface {
    $this->set('created', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);

    // If no revision author has been set explicitly, make the current user
    // the revision author.
    if (!$this->getRevisionUser()) {
      $this->setRevisionUserId(\Drupal::currentUser()->id());
    }

    \Drupal::service('apigee_api_catalog.spec_fetcher')->fetchSpec($this, FALSE, FALSE);

    // API docs that use the "file" source will still need their md5 updated.
    if ($this->get('spec_file_source')->value === static::SPEC_AS_FILE) {
      $spec_value = $this->get('spec')->isEmpty() ? [] : $this->get('spec')->getValue()[0];
      if (!empty($spec_value['target_id'])) {
        /* @var \Drupal\file\Entity\File $file */
        $file = $this->entityTypeManager()
          ->getStorage('file')
          ->load($spec_value['target_id']);

        if ($file) {
          $this->set('spec_md5', md5_file($file->getFileUri()));
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function preSaveRevision(EntityStorageInterface $storage, \stdClass $record) {
    parent::preSaveRevision($storage, $record);

    if (!$this->isNewRevision() && isset($this->original) && empty($record->revision_log_message)) {
      // If we are updating an existing entity without adding a new revision, we
      // need to make sure $entity->revision_log_message is reset whenever it is
      // empty. Therefore, this code allows us to avoid clobbering an existing
      // log  entry with an empty one.
      $record->revision_log_message = $this->original->revision_log_message->value;
    }
  }

  /**
   * Gets whether a new revision should be created by default.
   *
   * @return bool
   *   TRUE if a new revision should be created by default.
   */
  public function shouldCreateNewRevision() {
    $config = \Drupal::config(ApiDocSettingsForm::CONFIG_NAME);
    $default_revision = $config->get('default_revision');
    return is_null($default_revision) ? TRUE : (bool) $default_revision;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the API.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 255,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

    $fields['description'] = BaseFieldDefinition::create('text_long')
      ->setLabel(t('Description'))
      ->setDescription(t('Description of the API.'))
      ->setRevisionable(TRUE)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'text_default',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('view', TRUE)
      ->setDisplayOptions('form', [
        'type' => 'text_textfield',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('form', TRUE);

    $fields['spec_file_source'] = BaseFieldDefinition::create('list_string')
      ->setLabel(t('Specification source type'))
      ->setDescription(t('Indicate if the OpenAPI spec will be provided as a
                          file for upload or a URL.'))
      ->setDefaultValue(ApiDocInterface::SPEC_AS_FILE)
      ->setRequired(TRUE)
      ->setSetting('allowed_values', [
        ApiDocInterface::SPEC_AS_FILE => t('File'),
        ApiDocInterface::SPEC_AS_URL => t('URL'),
      ])
      ->setDisplayOptions('form', [
        'type' => 'options_buttons',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    $fields['spec'] = BaseFieldDefinition::create('file')
      ->setLabel(t('OpenAPI specification'))
      ->setDescription(t('The spec snapshot.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'file_directory' => 'apidoc_specs',
        'file_extensions' => 'yml yaml json',
        'handler' => 'default:file',
        'text_processing' => 0,
      ])
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'apigee_api_catalog_smartdocs',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'label' => 'hidden',
        'type' => 'file_generic',
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['file_link'] = BaseFieldDefinition::create('file_link')
      ->setLabel(t('URL to OpenAPI specification file'))
      ->setDescription(t('The URL to an OpenAPI file spec.'))
      ->addConstraint('ApiDocFileLink')
      ->setSettings([
        'file_extensions' => 'yml yaml json',
        'link_type' => LinkItemInterface::LINK_GENERIC,
        'title' => DRUPAL_DISABLED,
      ])
      ->setDisplayOptions('form', [
        'weight' => 0,
      ])
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    $fields['spec_md5'] = BaseFieldDefinition::create('string')
      ->setLabel(t('OpenAPI specification file MD5'))
      ->setDescription(t('OpenAPI specification file MD5'))
      ->setSettings([
        'text_processing' => 0,
      ])
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    if (\Drupal::moduleHandler()->moduleExists('apigee_edge')) {
      $fields['api_product'] = BaseFieldDefinition::create('entity_reference')
        ->setLabel(t('API Product'))
        ->setDescription(t('The API Product this API is associated with.'))
        ->setRevisionable(TRUE)
        ->setSetting('target_type', 'api_product')
        ->setDisplayConfigurable('form', FALSE)
        ->setDisplayConfigurable('view', FALSE);
    }

    $fields['status']
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the API Doc is published.'))
      ->setDisplayOptions('form', [
        'type' => 'boolean_checkbox',
        'weight' => 1,
      ])
      ->setDisplayConfigurable('form', TRUE);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'))
      ->setRevisionable(TRUE);

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'))
      ->setRevisionable(TRUE);

    $fields['fetched_timestamp'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('Spec fetched from URL timestamp'))
      ->setDescription(t('When the OpenAPI spec file was last fetched from URL as a Unix timestamp.'));

    // Store whether product access should be checked per entity.
    $fields['product_access_control'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('`product_access_control` placeholder'))
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  protected function urlRouteParameters($rel) {
    $uri_route_parameters = parent::urlRouteParameters($rel);

    if ($rel === 'revision-revert-form' && $this instanceof RevisionableInterface) {
      $uri_route_parameters[$this->getEntityTypeId() . '_revision'] = $this->getRevisionId();
    }

    return $uri_route_parameters;
  }

}
