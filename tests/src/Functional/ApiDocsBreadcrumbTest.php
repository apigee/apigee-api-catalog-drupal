<?php

/**
 * Copyright 2022 Google Inc.
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
 * Tests apidoc breadcrumb.
 *
 * @group apigee_api_catalog
 */
class ApiDocsBreadcrumbTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'olivero';

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'path_alias',
    'apigee_api_catalog',
    'views',
    'block',
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
    $this->drupalPlaceBlock('system_breadcrumb_block');
    $this->drupalPlaceBlock('page_title_block');

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
  public function testApiDocBreadcrumb() {
    // Tests the normal response.
    $url = Url::fromRoute('entity.node.canonical', ['node' => $this->apidoc->id()]);
    $this->drupalGet($url);

    // Fetch each node title in the current breadcrumb.
    $links = $this->xpath('//nav[@class="breadcrumb"]/ol/li/a');
    $got_breadcrumb = [];
    foreach ($links as $link) {
      $got_breadcrumb[] = $link->getText();
    }
    // print_r($got_breadcrumb);
    $this->assertEquals($got_breadcrumb[0], 'Home');
    $this->assertEquals($got_breadcrumb[1], 'API Catalog');

  }

}
