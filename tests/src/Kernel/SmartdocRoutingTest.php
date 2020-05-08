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

use Drupal\Core\Url;
use Drupal\KernelTests\KernelTestBase;
use Drupal\Tests\user\Traits\UserCreationTrait;
use Symfony\Component\HttpFoundation\Request;

/**
 * Tests smartdoc routing compatibility.
 *
 * @group apigee_api_catalog
 */
class SmartdocRoutingTest extends KernelTestBase {

  use UserCreationTrait;

  protected static $modules = [
    'user',
    'node',
    'field',
    'system',
    'apigee_edge',
    'key',
    'options',
    'text',
    'file',
    'link',
    'file_link',
    'filter',
    'path',
    'path_alias',
    'apigee_api_catalog',
  ];

  /**
   * A test doc.
   *
   * @var \Drupal\node\NodeInterface
   */
  private $apidoc;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->installSchema('system', ['sequences']);
    $this->installSchema('user', ['users_data']);
    $this->installSchema('node', ['node_access']);
    $this->installEntitySchema('user');
    $this->installEntitySchema('node');
    $this->installEntitySchema('node_type');
    $this->installEntitySchema('path_alias');
    $this->installConfig(static::$modules);

    $this->apidoc = $this->container->get('entity_type.manager')
      ->getStorage('node')
      ->create([
        'type' => 'apidoc',
        'title' => 'API 1',
        'body' => [
          'value' => 'Test API 1',
          'format' => 'basic_html',
        ],
        'field_apidoc_spec' => NULL,
      ]);

    $this->apidoc->save();

    $user = $this->createUser(['access content']);
    $this->setCurrentUser($user);
  }

  /**
   * Tests the route subscriber will redirect from smartdoc routes.
   */
  public function testNotFoundSubscriber() {
    $this->assertEqual($this->apidoc->id(), 1);

    // This needs to run before the alias can be picked up?
    $this->apidoc->toUrl()->toString();
    $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/1', $this->apidoc->language()->getId());
    $this->assertEqual($alias, '/api/1');

    // Tests the normal response.
    $path = Url::fromRoute('entity.node.canonical', ['node' => $this->apidoc->id()])->toString();
    $request = Request::create($path);
    $response = $this->container->get('http_kernel')->handle($request);
    static::assertSame(200, $response->getStatusCode());
    static::assertEmpty($response->headers->get('location'));

    // Test that the smartdoc routes redirect to the canonical route.
    $request = Request::create('/api/1/1/overview');
    $response = $this->container->get('http_kernel')->handle($request);

    static::assertSame(302, $response->getStatusCode());
    static::assertSame('/api/1', $response->headers->get('location'));
  }

}
