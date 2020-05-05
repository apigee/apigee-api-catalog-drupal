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
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Url;
use Drupal\Tests\BrowserTestBase;
use GuzzleHttp\RequestOptions;

/**
 * Tests listing API Docs using JSON:API.
 *
 * @group apigee_api_catalog
 */
class ApiDocsJsonApi extends BrowserTestBase {

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
      'name' => 'Published',
      'description' => 'Published API',
      'field_apidoc_spec' => NULL,
      'status' => 1,
    ]);
    $apidoc_published->save();
    $this->apidocPublished = $apidoc_published;

    // Create unpublished apidoc.
    $apidoc_unpublished = ApiDoc::create([
      'name' => 'Unpublished',
      'description' => 'Unpublished API',
      'field_apidoc_spec' => NULL,
      'status' => 0,
    ]);
    $apidoc_unpublished->save();
    $this->apidocUnpublished = $apidoc_unpublished;
  }

  /**
   * Test listing API Docs as an admin.
   *
   * Admin should see all API Docs.
   */
  public function testListAdminAccess() {
    // Test the 'administer apigee api catalog' permission.
    $account = $this->drupalCreateUser([
      'administer apigee api catalog',
    ]);
    $this->drupalLogin($account);

    $collection_url = Url::fromRoute('jsonapi.apidoc--apidoc.collection')
      ->setAbsolute(TRUE)->toString();

    $this->verifyAccess($account, [$this->apidocPublished, $this->apidocUnpublished], $collection_url);
  }

  /**
   * Make sure admin can filter and get results back.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function testFilterAdminAccess() {
    $account = $this->drupalCreateUser([
      'administer apigee api catalog',
    ]);
    $this->drupalLogin($account);

    $collection_url = Url::fromRoute('jsonapi.apidoc--apidoc.collection')
      ->setAbsolute(TRUE)->toString();
    $url = "${collection_url}?filter[name]=Published";
    $this->verifyAccess($account, [$this->apidocPublished], $url);

    $url = "${collection_url}?filter[name]=Unpublished";
    $this->verifyAccess($account, [$this->apidocUnpublished], $url);
  }

  /**
   * View published permission can filter published docs.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function testFilterViewAccessViewPublished() {
    $account = $this->drupalCreateUser([
      'view published apidoc entities',
    ]);
    $this->drupalLogin($account);

    $collection_url = Url::fromRoute('jsonapi.apidoc--apidoc.collection')
      ->setAbsolute(TRUE)->toString();
    $url = "${collection_url}?filter[name]=Published";
    $this->verifyAccess($account, [$this->apidocPublished], $url);
  }

  /**
   * View published and unpublished permissions can see published docs.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function testFilterViewPublishedWithViewPublishedAndUnpublishedPermissions() {
    $account = $this->drupalCreateUser([
      'view published apidoc entities',
      'view unpublished apidoc entities',
    ]);
    $this->drupalLogin($account);

    $collection_url = Url::fromRoute('jsonapi.apidoc--apidoc.collection')
      ->setAbsolute(TRUE)->toString();
    $url = "${collection_url}?filter[name]=Published";
    $this->verifyAccess($account, [$this->apidocPublished], $url);
  }

  /**
   * View published and unpublished permissions can see unpublished docs.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function testFilterViewUnpublishedWithViewPublishedAndUnpublishedPermissions() {
    $account = $this->drupalCreateUser([
      'view published apidoc entities',
      'view unpublished apidoc entities',
    ]);
    $this->drupalLogin($account);

    $collection_url = Url::fromRoute('jsonapi.apidoc--apidoc.collection')
      ->setAbsolute(TRUE)->toString();

    $url = "${collection_url}?filter[name]=Unpublished";
    $this->verifyAccess($account, [$this->apidocUnpublished], $url);
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

  /**
   * Verify the account has access when making JSON:API call.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The account to send the call.
   * @param array $apidocs_expected
   *   An array of the expected API Docs.
   * @param string $url
   *   The URL to call.
   * @param array $request_options
   *   Any request parameters to pass in such as filter query params.
   */
  protected function verifyAccess(AccountInterface $account, array $apidocs_expected, string $url, array $request_options = []) {

    // Need this header to make calls.
    $request_options[RequestOptions::HEADERS]['Accept'] = 'application/vnd.api+json';
    // Add request options and basic auth header together.
    $request_options = NestedArray::mergeDeep($request_options, $this->getAuthenticationRequestOptions($account));

    $client = $this->getSession()->getDriver()->getClient()->getClient();

    // Make the API call.
    $response = $client->request('GET', $url, $request_options);

    $this->assertSame(['application/vnd.api+json'], $response->getHeader('Content-Type'));
    $response_document = Json::decode((string) $response->getBody());

    // Get the API Docs from response and create array of names fetched.
    $apidocs_response = $response_document['data'];
    $names = [];
    foreach ($apidocs_response as $apidoc) {
      $names[] = $apidoc['attributes']['name'];
    }

    // Sort expected and actual response results by name for comparison.
    usort($apidocs_expected, function ($a, $b) {
      return strcmp($a->getName(), $b->getName());
    });
    usort($apidocs_response, function ($a, $b) {
      return strcmp($a['attributes']['name'], $b['attributes']['name']);
    });
    for ($i = 0; $i < count($apidocs_response); $i++) {
      $this->assertEqual($apidocs_expected[$i]->getName(), $apidocs_response[$i]['attributes']['name']);
    }
    // Make sure the count is the same.
    $this->assertCount(count($apidocs_expected), $apidocs_response, 'Count of API Docs returned does not match count of expected.');
  }

}
