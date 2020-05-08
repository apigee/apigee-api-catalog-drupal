# Apigee API Catalog for Drupal

Render OpenAPI specs as documentation to your API developers.

## Overview

When you enable this module, it creates a new content type named
"API Doc". You can add new API docs under __Content > API catalog__ in the admin menu.

Once added, the API name and description for each API Doc will be displayed in the
"APIs" menu item on the site using a Drupal view.

The OpenAPI spec by default is rendered using Apigee's SmartDocs custom field formatter.

The OpenAPI spec can be directly uploaded as a file, or associated to a source location
such as Apigee Edge or a URL. A "Re-import OpenAPI spec" operation is available per
API Doc to re-import the spec file when source location changes.

The OpenAPI spec by default is shown on the API Doc detail page by default.
To render the OpenAPI spec using Swagger UI:

1. Install and enable the [Swagger UI Field Formatter](https://www.drupal.org/project/swagger_ui_formatter) module.
2. Install the Swagger UI JS library as documented [on the module page](https://www.drupal.org/project/swagger_ui_formatter).
3. Go to __Configuration > API docs > Manage display__ in the admin menu.
4. Change "OpenAPI specification" field format to use the Swagger UI field formatter.

The API Doc is an node type, you can configure it at __Structure > Content types > API Doc__ in the admin
menu.

The "/apis" page ("APIs" menu link) is a view. You can modify it by editing the "API Catalog" view
under __Structure > Views__ in the admin menu.

## API Docs RBAC (Role based access control)
This API Doc is a node type, so any node access control module from contrib will work to restrict access and play well
with views. To set up an RBAC, we recommend ["Permissions by term"](https://www.drupal.org/project/permissions_by_term),
which can cover the following scenarios:

- Restrict access on reading docs or creating apps:
As an API Provider, I only want certain developers or teams of developers to read documentation or use a given
API product so that I can hide that API Product from most developers.
To implement using "Permissions by term":
1. Create roles that match the API Product RBAC, and assign users accordingly.
2. Create a new term for each of the roles.
3. On the API Doc node, tag it with the desired term.

- Restrict access to creating apps
As an API Provider, I want any developer or teams of developers to be able to read documentation about a given
API product, but want to only allow certain developers to be able to use that API product so that we can add manual or
automatic steps before approving access.
To implement using "Permissions by term":
1. Create a role for each teams of developers, and assign users accordingly. (The important step here is that the
API Product RBAC does not need to match the API Doc's.)
2. Create a new term and allow above the role(s) on it.
3. On the API Doc node, tag it with the above term.

- Set access defaults for new API Products
As an API provider, I want to set the access control of a new API Product to be hidden for all users except
certain people on my team so that developers do not use the product until I have tested it.
To implement using "Permissions by term":
1. Create a role for your team, and assign users accordingly.
2. Create a new term and allow above the role on it.
3. On the API Doc node, tag it with the above term.

Note: The instructions outlined above will only control access to the API Doc, not to the API product.

## Planned Features

- Integration with Apigee API Products.
- Add visual notifications when source URL specs have changed on the API Doc admin screen

### Known issues

- [Backwards compatibility with the version 1.x of this module is a separate issue](https://github.com/apigee/apigee-api-catalog-drupal/issues/80), you can subscribe to notifications to follow the status.

- The Apigee SmartDocs formatter can only render one OpenAPI spec per page and the URL pattern
  must match `/api/{entityId}`.  This means that the formatter will probably not work correctly if
  you modify the default API Docs view or try to use this file Formatter on other node types or entities.

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
