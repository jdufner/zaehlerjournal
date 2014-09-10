'use strict';

/* Filters */

angular.module('zaehlerjournal.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('encodeUri', function() {
    return window.encodeURI;
  })
  .filter('encodeUriComponent', function() {
    return window.encodeURIComponent;
  })
;
