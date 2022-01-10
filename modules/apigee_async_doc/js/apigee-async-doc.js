/**
 * Copyright 2022 Google Inc.
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
 * Custom scripts to render file fields with Apigee Asyncapi Doc.
 */

 (function ($, window, Drupal, drupalSettings) {

  Drupal.behaviors.apigeeAsyncFormatter = {
    attach: function(context) {
      // Iterate over fields and render each field item.
      for (var fieldName in drupalSettings.apigeeAsyncDocFormatter) {
        if (drupalSettings.apigeeAsyncDocFormatter.hasOwnProperty(fieldName)) {
          var field = drupalSettings.apigeeAsyncDocFormatter[fieldName];
          for (var fieldDelta = 0; fieldDelta < field.asyncUrls.length; fieldDelta++) {
            // ReactDOM.render(
            //   React.createElement(GraphiQL, {
            //     fetcher: GraphiQL.createFetcher({ url: field.asyncUrls[fieldDelta] }),
            //     // query: parameters.query,
            //     // variables: parameters.variables,
            //     // headers: parameters.headers,
            //     // operationName: parameters.operationName,
            //     // onEditQuery: onEditQuery,
            //     // onEditVariables: onEditVariables,
            //     // onEditHeaders: onEditHeaders,
            //     defaultSecondaryEditorOpen: true,
            //     // onEditOperationName: onEditOperationName,
            //     headerEditorEnabled: true,
            //     shouldPersistHeaders: true,
            //   }),
            //   document.getElementById('apigee-async-doc-' + fieldName + '-' + fieldDelta),
            // );
          }
        }
      }
    }
  };

}(jQuery, window, Drupal, drupalSettings));
