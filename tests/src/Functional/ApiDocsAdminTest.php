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

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Url;
use Drupal\file\Entity\File;
use Drupal\Tests\BrowserTestBase;
use Drupal\Tests\TestFileCreationTrait;

/**
 * Simple test to ensure that main page loads with module enabled.
 *
 * @group apigee_api_catalog
 */
class ApiDocsAdminTest extends BrowserTestBase {

  use TestFileCreationTrait;

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * Modules to enable.
   *
   * @var array
   */
  public static $modules = ['views', 'apigee_api_catalog', 'block', 'field_ui'];

  /**
   * A user with permission to administer site configuration.
   *
   * @var \Drupal\user\UserInterface
   */
  protected $adminUser;

  /**
   * Set up menus and tasks in their regions.
   *
   * Since menus and tasks are now blocks, we're required to explicitly set them
   * to regions.
   */
  protected function setupMenus() {
    $this->drupalPlaceBlock('local_actions_block');
    $this->drupalPlaceBlock('local_tasks_block');
  }

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    // Add the system menu blocks to appropriate regions.
    $this->setupMenus();

    $this->adminUser = $this->drupalCreateUser([
      'access content',
      'access content overview',
      'create apidoc content',
      'edit any apidoc content',
      'delete any apidoc content',
    ]);
    $this->drupalLogin($this->adminUser);
  }

  /**
   * Tests that a user can administer API Docs.
   */
  public function testApiDocAdministration() {
    $assert = $this->assertSession();

    // Get the API Doc admin page.
    $this->drupalGet(Url::fromRoute('view.api_catalog_admin.page_1'));

    // No API docs yet.
    $assert->pageTextContains('There are no API docs yet.');

    // User can add entity content.
    $assert->linkExists('Add API Doc');
    $this->clickLink('Add API Doc');

    // Fields should have proper defaults.
    $assert->fieldValueEquals('title[0][value]', '');
    $assert->fieldValueEquals('body[0][value]', '');

    // Create a new spec in site.
    $file = File::create([
      'uid' => $this->adminUser->id(),
      'filename' => 'specA.yml',
      'uri' => 'public://specA.yml',
      'filemime' => 'application/octet-stream',
      'created' => 1,
      'changed' => 1,
      'status' => FILE_STATUS_PERMANENT,
    ]);
    file_put_contents($file->getFileUri(), "swagger: '2.0'");

    // Save it, inserting a new record.
    $file->save();
    $this->assertTrue($file->id() > 0, 'The file was added to the database.');

    $page = $this->getSession()->getPage();
    $random_name = $this->randomMachineName();
    $random_description = $this->randomGenerator->sentences(5);
    $page->fillField('title[0][value]', $random_name);
    $page->fillField('body[0][value]', $random_description);
    $page->fillField('field_apidoc_spec_file_source', 'file');

    // Can't use drupalPostForm() to set hidden fields.
    $this->getSession()->getPage()->find('css', 'input[name="field_apidoc_spec[0][fids]"]')->setValue($file->id());
    $this->getSession()->getPage()->pressButton(t('Save'));

    $assert->statusCodeEquals(200);
    $assert->pageTextContains(new FormattableMarkup('API Doc @name has been created.', ['@name' => $random_name]));

    // Entity listed.
    $assert->linkExists($random_name);
    $assert->linkExists('Edit');
    $assert->linkExists('Delete');

    // Click on API Doc to edit.
    $this->clickLink('Edit');
    $assert->statusCodeEquals(200);

    // Edit form should have proper values.
    $assert->fieldValueEquals('title[0][value]', $random_name);
    $assert->fieldValueEquals('body[0][value]', $random_description);
    $assert->linkExists('specA.yml');

    // Delete the entity.
    $this->clickLink('Delete');
  }

}
