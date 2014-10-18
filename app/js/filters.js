'use strict';

/* Filters */

angular.module('zaehlerjournal.filters', [])
  .filter('encodeUri', function() {
    return window.encodeURI;
  })
  .filter('encodeUriComponent', function() {
    return window.encodeURIComponent;
  })
;
