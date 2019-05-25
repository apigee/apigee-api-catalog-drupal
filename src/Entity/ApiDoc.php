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

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\link\LinkItemInterface;

/**
 * Defines the API Doc entity.
 *
 * @ContentEntityType(
 *   id = "apidoc",
 *   label = @Translation("API Doc"),
 *   label_singular = @Translation("API Doc"),
 *   label_plural = @Translation("API Docs"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\apigee_api_catalog\Entity\ListBuilder\ApiDocListBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "translation" = "Drupal\content_translation\ContentTranslationHandler",
 *     "form" = {
 *       "default" = "Drupal\apigee_api_catalog\Entity\Form\ApiDocForm",
 *       "add" = "Drupal\apigee_api_catalog\Entity\Form\ApiDocForm",
 *       "edit" = "Drupal\apigee_api_catalog\Entity\Form\ApiDocForm",
 *       "delete" = "Drupal\apigee_api_catalog\Entity\Form\ApiDocDeleteForm",
 *       "reimport_spec" = "Drupal\apigee_api_catalog\Form\ApiDocReimportSpecForm",
 *     },
 *     "access" = "Drupal\apigee_api_catalog\Entity\Access\ApiDocAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\apigee_api_catalog\Entity\Routing\ApiDocHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "apidoc",
 *   data_table = "apidoc_field_data",
 *   translatable = TRUE,
 *   admin_permission = "administer apigee api catalog",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "langcode" = "langcode",
 *     "status" = "status",
 *   },
 *   links = {
 *     "canonical" = "/api/{apidoc}",
 *     "add-form" = "/admin/content/api/add",
 *     "edit-form" = "/admin/content/api/{apidoc}/edit",
 *     "delete-form" = "/admin/content/api/{apidoc}/delete",
 *     "reimport-spec-form" = "/admin/content/api/{apidoc}/reimport",
 *     "collection" = "/admin/content/apis",
 *   },
 *   field_ui_base_route = "entity.apidoc.settings"
 * )
 */
class ApiDoc extends ContentEntityBase implements ApiDocInterface {

  use EntityChangedTrait;
  use StringTranslationTrait;

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
  public function isPublished(): bool {
    return (bool) $this->getEntityKey('status');
  }

  /**
   * {@inheritdoc}
   */
  public function setPublished(bool $published): ApiDocInterface {
    $this->set('status', $published);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the API.'))
      ->setSettings([
        'max_length' => 50,
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
      ->setLabel(t('OpenAPI specification file source'))
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
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['spec'] = BaseFieldDefinition::create('file')
      ->setLabel('OpenAPI specification file')
      ->setDescription('The spec snapshot.')
      ->setSettings([
        'file_directory' => 'apidoc_specs',
        'file_extensions' => 'yml yaml json',
        'hander' => 'default:file',
        'text_processing' => 0,
      ])
      ->setDisplayOptions('form', [
        'label' => 'above',
        'type' => 'file',
        'weight' => -4,
      ])->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'apigee_api_catalog_smartdocs',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'label' => 'hidden',
        'type' => 'file_generic',
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

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
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['spec_md5'] = BaseFieldDefinition::create('string')
      ->setLabel(t('OpenAPI specification file MD5'))
      ->setDescription(t('OpenAPI specification file MD5'))
      ->setSettings([
        'text_processing' => 0,
      ])
      ->setDisplayConfigurable('form', FALSE)
      ->setDisplayConfigurable('view', FALSE);

    $fields['api_product'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('API Product'))
      ->setDescription(t('The API Product this API is associated to.'))
      ->setSetting('target_type', 'api_product')
      ->setDisplayOptions('form', [
        'label' => 'above',
        'type' => 'entity_reference_autocomplete',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the API Doc is published.'))
      ->setDefaultValue(TRUE)
      ->setDisplayOptions('form', [
        'type' => 'boolean_checkbox',
        'weight' => 1,
      ]);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    $fields['fetched_timestamp'] = BaseFieldDefinition::create('timestamp')
      ->setLabel(t('Spec fetched from URL timestamp'))
      ->setDescription(t('When the OpenAPI spec file was last fetched from URL as a Unix timestamp.'));

    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);

    \Drupal::service('apigee_api_catalog.spec_fetcher')->fetchSpec($this, FALSE, FALSE);

    // Update spec_md5 value if using "file" as source.
    if ($this->get('spec_file_source')->value == static::SPEC_AS_FILE) {
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

}
