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
  $routeProvider.when('/uebersicht', {templateUrl: 'partials/uebersicht.html', controller: 'UebersichtCtrl'});
  $routeProvider.when('/zaehler/:zaehlerNr', {templateUrl: 'partials/details.html', controller: 'DetailsCtrl'});
  $routeProvider.when('/erfassung', {templateUrl: 'partials/erfassung.html', controller: 'ErfassungCtrl'});
  $routeProvider.otherwise({redirectTo: '/uebersicht'});
}]);
