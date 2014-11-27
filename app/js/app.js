'use strict';

// Declare app level module which depends on filters, and services
var ZaehlerjournalApp = angular.module('zaehlerjournal', [
  'ngRoute',
  'zaehlerjournal.filters',
  'zaehlerjournal.services',
  'zaehlerjournal.directives',
  // Fachlichen Module
  'zaehlerjournal.uebersicht',
  'zaehlerjournal.einstellungen',
  'zaehlerjournal.einstellungenZaehler',
  'zaehlerjournal.erfassung'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/uebersicht'});
}])
.run(['$rootScope', function($rootScope){
  console.log('initialize ...');
}])
;

/*
 * Registriert einen Listen auf das deviceready-Event, für die Integration in Cordova.
 */
document.addEventListener('deviceready', function onDeviceReady() {
  angular.bootstrap(document, ['zaehlerjournal']);
}, false);
