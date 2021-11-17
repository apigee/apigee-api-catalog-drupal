/**
 * Copyright 2021 Google Inc.
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

/**
 * @file
 * Custom scripts to render file fields with Apigee Graphql Doc.
 */

 (function ($, window, Drupal, drupalSettings) {

  Drupal.behaviors.apigeeGraphqlFormatter = {
    attach: function(context) {
      // Iterate over fields and render each field item.
      for (var fieldName in drupalSettings.apigeeGraphqlDocFormatter) {
        if (drupalSettings.apigeeGraphqlDocFormatter.hasOwnProperty(fieldName)) {
          var field = drupalSettings.apigeeGraphqlDocFormatter[fieldName];
          for (var fieldDelta = 0; fieldDelta < field.graphqlUrls.length; fieldDelta++) {
            ReactDOM.render(
              React.createElement(GraphiQL, {
                fetcher: GraphiQL.createFetcher({ url: field.graphqlUrls[fieldDelta] }),
                // query: parameters.query,
                // variables: parameters.variables,
                // headers: parameters.headers,
                // operationName: parameters.operationName,
                // onEditQuery: onEditQuery,
                // onEditVariables: onEditVariables,
                // onEditHeaders: onEditHeaders,
                defaultSecondaryEditorOpen: true,
                // onEditOperationName: onEditOperationName,
                headerEditorEnabled: true,
                shouldPersistHeaders: true,
              }),
              document.getElementById('apigee-graphql-doc-' + fieldName + '-' + fieldDelta),
            );
          }
        }
      }
    }
  };

}(jQuery, window, Drupal, drupalSettings));
