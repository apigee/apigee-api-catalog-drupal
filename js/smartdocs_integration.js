/**
 * @file
 * Integration of SmartDocs file field formatter.
 */

(function ($, window, Drupal) {

  Drupal.behaviors.smartdocsFieldFormatter = {
    attach: function (context) {
      let specMap = {};
      for (let fieldName in drupalSettings.smartdocsFieldFormatter) {
        if (drupalSettings.smartdocsFieldFormatter.hasOwnProperty(fieldName)) {
          const field = drupalSettings.smartdocsFieldFormatter[fieldName];
          for (let fieldDelta = 0; fieldDelta < field.openApiFiles.length; fieldDelta++) {
             specMap[field.entityId] = field.openApiFiles[fieldDelta];
          }
        }
      }
      sessionStorage.setItem('specs', JSON.stringify(specMap));
    }
  };

}(jQuery, window, Drupal));
