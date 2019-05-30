# Apigee API Catalog for Drupal

Render OpenAPI specs as documentation to your API developers.

## Overview

When you enable this module, it creates a new Drupal entity in your system named
"API Doc". You can add new API docs under __Configuration > API catalog__ in the admin menu.

Once added, the API name and description for each API Doc will be displayed in the
"APIs" menu item on the site using a Drupal view. Make sure to change the 
"View published API docs" permissions if you want to allow registered or anonymous users 
to be able to view published API documentation.

The OpenAPI spec by default is rendered using Apigee SmartDocs.

The OpenAPI spec can be directly uploaded as a file, or associated to a source location
such as Apigee Edge or a URL. A "Re-import OpenAPI spec" operation is available per
API Doc to re-import the spec file when source location changes.

The OpenAPI spec by default is shown on the API Doc detail page by default.
To render the OpenAPI spec using Swagger UI:

1. Install an enable the [Swagger UI Field Formatter](https://www.drupal.org/project/swagger_ui_formatter) module.
2. Install the Swagger UI JS library as documented [on the module page](https://www.drupal.org/project/swagger_ui_formatter).
3. Go to __Configuration > API catalog > Manage display__ in the admin menu.
4. Change "OpenAPI specification" field format to use the Swagger UI field formatter.

The API Doc is an entity, you can configure it at __Configuration > API catalog__ in the admin
menu.

The "APIs" menu link is a view, you can modify it by editing the "API Catalog" view
under Structure > Views in the admin menu.

## Planned Features

- Integration with Apigee API Products
- Add visual notifications when source URL specs have changed on the API Doc admin screen

### Known issues

- The Apigee SmartDocs formatter can only render one OpenAPI spec per page and the URL pattern
  must match `/api/{entityId}`.  This means that the formatter will probably not work correctly if 
  you modify the default API Docs view or try to use this file Formatter on nodes or other entities.

## Installing

This module must be installed on a Drupal site that is managed by Composer. Drupal.org has documentation on how to
[use Composer to manage Drupal site dependencies](https://www.drupal.org/docs/develop/using-composer/using-composer-to-manage-drupal-site-dependencies) 
to get you started quickly.

1. Install the module using [Composer](https://getcomposer.org/).
  Composer will download the this module and all its dependencies.
  **Note**: Composer must be executed at the root of your Drupal installation.
  For example:
   ```
   cd /path/to/drupal/root
   composer require drupal/apigee_api_catalog
   ```
   For more information about installing contributed modules using Composer, read 
   [how to download contributed modules and themes using Composer](https://www.drupal.org/docs/develop/using-composer/using-composer-to-manage-drupal-site-dependencies#managing-contributed).
2. Choose **Extend** in the Drupal administration menu.
3. Select the **Apigee API catalog** module.
4. Choose **Install**.

## Development

Development is happening in our [GitHub repository](https://github.com/apigee/apigee-api-catalog-drupal). The Drupal.org issue 
queue is disabled; we use the [Github issue queue](https://github.com/apigee/apigee-api-catalog-drupal) to coordinate 
development. See [CONTRIBUTING.md] for more information on contributing through development.

## Support

This project, which integrates Drupal 8 with Apigee Edge, is supported by Google.
