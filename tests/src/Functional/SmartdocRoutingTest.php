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

namespace Drupal\Tests\apigee_api_catalog\Functional;

use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase;

/**
 * Tests smartdoc routing compatibility.
 *
 * @group apigee_api_catalog
 */
class SmartdocRoutingTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'path_alias',
    'apigee_api_catalog',
  ];

  /**
   * A test doc.
   *
   * @var \Drupal\node\NodeInterface
   */
  protected $apidoc;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

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

    $user = $this->drupalCreateUser(['access content']);
    $this->drupalLogin($user);
  }

  /**
   * Tests the route subscriber will redirect from smartdoc routes.
   */
  public function testNotFoundSubscriber() {
    $this->assertEquals($this->apidoc->id(), 1);

    // This needs to run before the alias can be picked up?
    $this->apidoc->toUrl()->toString();
    $alias = \Drupal::service('path_alias.manager')->getAliasByPath('/node/1', $this->apidoc->language()->getId());
    $this->assertEquals($alias, '/api/1');

    $assert = $this->assertSession();

    // Tests the normal response.
    $url = Url::fromRoute('entity.node.canonical', ['node' => $this->apidoc->id()]);
    $this->drupalGet($url);
    $assert->statusCodeEquals(200);
    static::assertEmpty($this->getSession()->getResponseHeader('location'));

    // Test the canonical route uses the /api/* path alias.
    $this->assertEquals(parse_url($this->getSession()->getCurrentUrl(), PHP_URL_PATH), '/api/1');

    // Tests the node alias response.
    $this->drupalGet('/api/1');
    $assert->statusCodeEquals(200);
    static::assertEmpty($this->getSession()->getResponseHeader('location'));

    // Test that the smartdoc routes redirect to the canonical route.
    $url = Url::fromUserInput('/api/1/1/overview')->setAbsolute();
    $response = $this->getHttpClient()->request('GET', $url->toString(), [
      'allow_redirects' => FALSE,
    ]);
    $this->assertEquals($response->getStatusCode(), 302);
    $this->assertEquals($response->getHeader('location')[0], '/api/1');
  }

}
