/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

/**
 * Module: TYPO3/CMS/Install/Cache
 */
define([
  'jquery',
  'TYPO3/CMS/Install/Router',
  'TYPO3/CMS/Backend/Icons',
  'TYPO3/CMS/Backend/Notification'
], function($, Router, Icons, Notification) {
  'use strict';

  return {
    initialize: function($trigger) {
      $.ajax({
        url: Router.getUrl('cacheClearAll', 'maintenance'),
        cache: false,
        beforeSend: function() {
          $trigger.addClass('disabled');
        },
        success: function(data) {
          if (data.success === true && Array.isArray(data.status)) {
            if (data.status.length > 0) {
              data.status.forEach((function(element) {
                Notification.success(element.title, element.message);
              }));
            }
          } else {
            Notification.error('Something went wrong clearing caches');
          }
        },
        error: function(xhr) {
          // In case the clear cache action fails (typically 500 from server), do not kill the entire
          // install tool, instead show a notification that something went wrong.
          Notification.error(
            'Clearing caches went wrong on the server side. Check the system for broken extensions or missing database tables and try again'
          );
        },
        complete: function() {
          $trigger.removeClass('disabled');
        }
      });
    }
  };
});
