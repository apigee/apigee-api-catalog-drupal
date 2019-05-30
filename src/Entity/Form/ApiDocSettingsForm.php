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

namespace Drupal\apigee_api_catalog\Entity\Form;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class ApiDocSettingsForm.
 *
 * Settings for the ApiDoc entity type.
 */
class ApiDocSettingsForm extends FormBase {

  public const CONFIG_NAME = 'apigee_api_catalog.apidoc.config';

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'apigee_api_catalog_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $entity_type = $this->entityTypeManager
      ->getStorage('apidoc')
      ->getEntityType();
    $config = $this->configFactory()->getEditable(static::CONFIG_NAME);

    $options = $form_state->getValue('options');
    $config->set('default_revision', (bool) $options['new_revision']);
    $config->set('enable_product_access_control', $form_state->getValue('enable_product_access_control'));
    // Save the config.
    $config->save();

    // Entity field info has to be rebuilt if you change how access control for
    // `apidoc` entities work.
    Cache::invalidateTags(['entity_field_info']);

    $this->messenger()->addStatus($this->t('@type settings have been updated.', [
      '@type' => $entity_type->getLabel(),
    ]));
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $settings = $this->config(static::CONFIG_NAME);

    /* @var \Drupal\apigee_api_catalog\Entity\ApiDoc $entity */
    $entity = $this->entityTypeManager->getStorage('apidoc')->create();
    $form['apigee_api_catalog_settings']['#markup'] = $this->t('Settings for Apigee API catalog. Manage field settings using the tabs above.');

    // Adds a group for access control.
    $form['access_control'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('Access control'),
    ];
    // Adds a flag that will alow enabling access control by API product.
    $form['access_control']['enable_product_access_control'] = [
      '#type' => 'select',
      '#title' => $this->t('Allow API product based access control'),
      '#description' => $this->t("Select how access to an API doc should be limited based on it's associated API product field from the following options:<br />
        <strong>Never:</strong> Access will not be limited by the API product field. Only the API doc access permissions are used to determine if a user will have access.<br />
        <strong>Always:</strong> Access to view an API doc will follow the same settings as the API product access control settings.<br />
        <strong>Configurable:</strong>Access to view an API doc will follow the same settings as the API product access control settings only if the \"Restrict access based on API product\" is checked on that individual API doc.
      "),
      '#options' => [
        'none' => $this->t('Never'),
        'always' => $this->t('Always'),
        'configurable' => $this->t('Configurable'),
      ],
      '#default_value' => $settings->get('enable_product_access_control'),
      '#group' => 'access_control',
    ];

    $form['additional_settings'] = [
      '#type' => 'vertical_tabs',
    ];

    $form['workflow'] = [
      '#type' => 'details',
      '#title' => $this->t('Publishing options'),
      '#group' => 'additional_settings',
    ];
    $workflow_options = [
      'new_revision' => $entity->shouldCreateNewRevision(),
    ];
    // Prepare workflow options to be used for 'checkboxes' form element.
    $workflow_options_keys = array_keys(array_filter($workflow_options));
    $workflow_options = array_combine($workflow_options_keys, $workflow_options_keys);
    $form['workflow']['options'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Default options'),
      '#default_value' => $workflow_options,
      '#options' => [
        'new_revision' => $this->t('Create new revision'),
      ],
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
    ];

    return $form;
  }

}
