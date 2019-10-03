<?php

/**
 * Copyright 2019 Google Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License version 2 as published by the
 * Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
 * License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

namespace Drupal\Tests\apigee_api_catalog\Functional;

use Drupal\apigee_api_catalog\Entity\ApiDoc;
use Drupal\Component\Serialization\Json;
use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase;
use GuzzleHttp\RequestOptions;

/**
 * Tests the ApiDoc term access permissions.
 *
 * @group apigee_api_catalog
 */
class ApiDocsJsonApiAccessTest extends BrowserTestBase {

  /**
   * Modules to enable.
   *
   * @var array
   */
  public static $modules = [
    'apigee_api_catalog',
    'jsonapi',
    'basic_auth',
  ];

  /**
   * A published API Doc.
   *
   * @var \Drupal\apigee_api_catalog\Entity\ApiDoc
   */
  protected $apidocPublished;

  /**
   * An unpublished API Doc.
   *
   * @var \Drupal\apigee_api_catalog\Entity\ApiDoc
   */
  protected $apidocUnpublished;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    // Create published apidoc.
    $apidoc_published = ApiDoc::create([
      'name' => 'API Published 1',
      'description' => 'Test API 1',
      'spec' => NULL,
      'status' => 1,
    ]);
    $apidoc_published->save();
    $this->apidocPublished = $apidoc_published;

    // Create unpublished apidoc.
    $apidoc_unpublished = ApiDoc::create([
      'name' => 'API Published 2',
      'description' => 'Test API 2',
      'spec' => NULL,
      'status' => 0,
    ]);
    $apidoc_unpublished->save();
    $this->apidocUnpublished = $apidoc_unpublished;
  }

  /**
   * Test listing API Docs as an admin.
   *
   * Should see both
   */
  public function testApiJsonApiDocListAccessAdmin() {
    $assert_session = $this->assertSession();

    // Test the 'administer apigee api catalog' permission.
    $account = $this->drupalCreateUser([
      'administer apigee api catalog',
    ]);
    $this->drupalLogin($account);

    $collection_url = Url::fromRoute('jsonapi.apidoc--apidoc.collection');
    $request_options = [];
    $request_options[RequestOptions::HEADERS]['Accept'] = 'application/vnd.api+json';
    $request_options = NestedArray::mergeDeep($request_options, $this->getAuthenticationRequestOptions($account));

    $client = $this->getSession()->getDriver()->getClient()->getClient();
    $response = $client->request('GET', $collection_url->setAbsolute(TRUE)->toString(), $request_options);
    $this->assertSame(['application/vnd.api+json'], $response->getHeader('Content-Type'));
    $response_document = Json::decode((string) $response->getBody());
    $apidoc_list = $response_document['data'];
    $this->assertCount(2, $apidoc_list);
    $names = [];
    foreach ($apidoc_list as $apidoc) {
      $names[] = $apidoc['attributes']['name'];
    }

    $this->assertContains('API Published 1', $names);
    $this->assertContains('API Published 2', $names);
  }

  /**
   * Returns Guzzle request options for authentication.
   *
   * @return array
   *   Guzzle request options to use for authentication.
   *
   * @see \GuzzleHttp\ClientInterface::request()
   */
  protected function getAuthenticationRequestOptions($account) {
    return [
      'headers' => [
        'Authorization' => 'Basic ' . base64_encode($account->name->value . ':' . $account->passRaw),
      ],
    ];
  }

}
