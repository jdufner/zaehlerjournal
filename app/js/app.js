'use strict';


// Declare app level module which depends on filters, and services
angular.module('zaehlerjournal', [
  'ngRoute',
  'zaehlerjournal.filters',
  'zaehlerjournal.services',
  'zaehlerjournal.directives',
  'zaehlerjournal.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/zaehler/:zaehlerNr', {templateUrl: 'partials/details.html', controller: 'DetailsCtrl'});
  $routeProvider.when('/einstellungen', {templateUrl: 'partials/einstellungen.html', controller: 'EinstellungenCtrl'});
  $routeProvider.when('/einstellungen/:adresseId', {templateUrl: 'partials/einstellungen.html', controller: 'EinstellungenCtrl'});
  $routeProvider.when('/erfassung', {templateUrl: 'partials/erfassung.html', controller: 'ErfassungCtrl'});
  $routeProvider.when('/uebersicht', {templateUrl: 'partials/uebersicht.html', controller: 'UebersichtCtrl'});
  $routeProvider.otherwise({redirectTo: '/uebersicht'});
}]).
run(['$rootScope', function($rootScope){
  console.log('initialize ...');
}]);
