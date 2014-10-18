'use strict';

/* Filters */

angular.module('zaehlerjournal.filters', [])
  .filter('encodeUri', function() {
    //console.log('filter.encodeUri');
    return window.encodeURI;
  })
  .filter('encodeUriComponent', function() {
    //console.log('filter.encodeUriComponent');
    return window.encodeURIComponent;
  })
;
