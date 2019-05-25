/**
 * @file
 * Integration of SmartDocs file field formatter.
 *
 * Take the OpenAPI spec and put into session storage for the SmartDocs
 * Angular app to use.
 */

(function ($, window, Drupal) {

  Drupal.behaviors.smartdocsFieldFormatter = {
    attach: function (context) {
      let specMap = {};
      for (let fieldName in drupalSettings.smartdocsFieldFormatter) {
        if (drupalSettings.smartdocsFieldFormatter.hasOwnProperty(fieldName)) {
          const field = drupalSettings.smartdocsFieldFormatter[fieldName];
          for (let fieldDelta = 0; fieldDelta < field.openApiFiles.length; fieldDelta++) {
            // Each openApiFile var has the spec url and file extension.
            const fileUrl = field.openApiFiles[fieldDelta].fileUrl;
            const fileExtention = field.openApiFiles[fieldDelta].fileExtension;
            // Get the OpenAPI spec file from the server.
            $.get(fileUrl, function(data, status) {
              if (fileExtention === 'json') {
                // JSON files do not need any conversion.
                specMap[field.entityId] = data;
              }
              else {
                // YAML files need to be parsed into javascript object.
                specMap[field.entityId]  = jsyaml.load(data);
             }
              // Store the spec into session storage.
              sessionStorage.setItem('specs', JSON.stringify(specMap));
            });
          }
        }
      }
    }
  };

}(jQuery, window, Drupal));
