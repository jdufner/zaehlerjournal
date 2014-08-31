'use strict';

/* Services */


// Demonstrate how to register services
var zaehlerjournalServices = angular.module('zaehlerjournal.services', ['ngResource']);

// In this case it is a simple value service.
zaehlerjournalServices.value('version', '0.1');

//
zaehlerjournalServices.factory('Zaehlerjournal', ['$resource',
  function($resource) {
    return $resource('zaehler/zaehler.json', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    });
  }
]);

zaehlerjournalServices.factory('Zaehlerdetails', ['$resource',
  function($resource) {
    return $resource('zaehler/:zaehlerNr.json', {}, {
      query: {
        method: 'GET',
        params: {
          zaehlerNr: 'zaehler'
        },
        isArray: true
      }
    });
  }
]);
