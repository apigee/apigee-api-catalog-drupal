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

namespace Drupal\Tests\apigee_api_catalog\Kernel;

use Drupal\KernelTests\KernelTestBase;

/**
 * Test basic CRUD operations for ApiDoc.
 *
 * @group apigee_api_catalog
 */
class ApidocEntityTest extends KernelTestBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'user',
    'node',
    'field',
    'system',
    'options',
    'text',
    'file',
    'link',
    'file_link',
    'path_alias',
    'key',
    'apigee_edge',
    'apigee_api_catalog',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installSchema('user', ['users_data']);
    $this->installSchema('node', ['node_access']);
    $this->installEntitySchema('user');
    $this->installEntitySchema('node');
    $this->installEntitySchema('node_type');
    $this->installEntitySchema('path_alias');
    $this->installConfig(static::$modules);

    $this->entityTypeManager = $this->container->get('entity_type.manager');
    $this->nodeStorage = $this->entityTypeManager->getStorage('node');
  }

  /**
   * Basic CRUD operations on a ApiDoc node entity.
   */
  public function testEntity() {
    $entity = $this->nodeStorage->create([
      'type' => 'apidoc',
      'title' => 'API 1',
      'body' => [
        'value' => 'Test API 1',
        'format' => 'basic_html',
      ],
      'field_apidoc_spec' => NULL,
    ]);

    $this->assertNotNull($entity);
    $this->assertEquals(SAVED_NEW, $entity->save());
    $this->assertEquals(SAVED_UPDATED, $entity->set('title', 'API 1a')->save());
    $entity_id = $entity->id();
    $this->assertNotEmpty($entity_id);

    // Test path alias.
    // This needs to run before the alias can be picked up?
    $entity->toUrl()->toString();
    $alias = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $entity->id(), $entity->language()->getId());
    $this->assertEqual($alias, '/api/' . $entity->id());

    $entity->delete();
    $this->assertNull($this->nodeStorage->load($entity_id));
  }

  /**
   * Test revisioning functionality on an apidocs entity.
   */
  public function testRevisions() {
    /* @var \Drupal\node\NodeInterface $entity */

    $description_v1 = 'Test API';
    $entity = $this->nodeStorage->create([
      'type' => 'apidoc',
      'title' => 'API 1',
      'body' => [
        'value' => $description_v1,
        'format' => 'basic_html',
      ],
      'field_apidoc_spec' => NULL,
    ]);

    // Test saving a revision.
    $entity->setNewRevision();
    $entity->setRevisionLogMessage('v1');
    $entity->save();
    $v1_id = $entity->getRevisionId();
    $this->assertNotNull($v1_id);

    // Test saving a new revision.
    $new_log = 'v2';
    $entity->body = [
      'value' => 'Test API v2',
      'format' => 'basic_html',
    ];
    $entity->setNewRevision();
    $entity->setRevisionLogMessage($new_log);
    $entity->save();
    $v2_id = $entity->getRevisionId();
    $this->assertLessThan($v2_id, $v1_id);

    // Test saving without a new revision.
    $entity->body = [
      'value' => 'Test API v3',
      'format' => 'basic_html',
    ];
    $entity->save();
    $this->assertEquals($v2_id, $entity->getRevisionId());

    // Test that the revision log message wasn't overriden.
    $this->assertEquals($new_log, $entity->getRevisionLogMessage());

    // Revert to the first revision.
    $entity_v1 = $this->nodeStorage->loadRevision($v1_id);
    $entity_v1->setNewRevision();
    $entity_v1->isDefaultRevision(TRUE);
    $entity_v1->setRevisionLogMessage('Copy of revision ' . $v1_id);
    $entity_v1->save();

    // Load and check reverted values.
    $this->nodeStorage->resetCache();
    $reverted = $this->nodeStorage->load($entity->id());
    $this->assertLessThan($reverted->getRevisionId(), $v1_id);
    $this->assertTrue($reverted->isDefaultRevision());
    $this->assertEquals($description_v1, $reverted->body->value);
  }

}
