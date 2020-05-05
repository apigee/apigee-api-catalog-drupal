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

use Drupal\apigee_api_catalog\Entity\ApiDoc;
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
    'system',
    'apigee_edge',
    'key',
    'apigee_api_catalog',
    'options',
    'text',
    'file',
    'file_link',
    'filter',
  ];

  /**
   * A test doc.
   *
   * @var \Drupal\apigee_api_catalog\Entity\ApiDoc
   */
  private $apidoc;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->installEntitySchema('user');
    $this->installEntitySchema('apidoc');

    $this->apidoc = ApiDoc::create([
      'name' => 'API 1',
      'description' => 'Test API 1',
      'field_apidoc_spec' => NULL,
      'field_apidoc_api_product' => NULL,
    ]);

    $this->apidoc->save();

    // Prepare to create a user.
    $this->installEntitySchema('user');
    $this->installSchema('system', ['sequences']);
    $this->installSchema('user', ['users_data']);

    // Rendering an apidoc requires the default filter formats be installed.
    $this->installConfig(['filter']);

    $user = $this->createUser(['view published apidoc entities']);
    $this->setCurrentUser($user);

  }

  /**
   * Tests the route subscriber will redirect from smartdoc routes.
   */
  public function testNotFoundSubscriber() {
    // Tests the normal response.
    $request = Request::create(Url::fromRoute('entity.apidoc.canonical', ['apidoc' => $this->apidoc->id()])->toString());
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
