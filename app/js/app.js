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
  $routeProvider.when('/einstellungen', {templateUrl: 'partials/einstellungen.html', controller: 'EinstellungenCtrl'});
  $routeProvider.when('/einstellungen/:adresse', {templateUrl: 'partials/einstellungenAdresse.html', controller: 'EinstellungenAdresseCtrl'});
  $routeProvider.when('/zaehler/:adresse', {templateUrl: 'partials/einstellungenZaehler.html', controller: 'EinstellungenZaehlerCtrl'});
  $routeProvider.when('/erfassung/:adresse', {templateUrl: 'partials/erfassung.html', controller: 'ErfassungCtrl'});
  $routeProvider.when('/uebersicht', {templateUrl: 'partials/uebersicht.html', controller: 'UebersichtCtrl'});
  $routeProvider.otherwise({redirectTo: '/uebersicht'});
}]).
run(['$rootScope', function($rootScope){
  console.log('initialize ...');
}]);
