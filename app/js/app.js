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
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/uebersicht'});
}]);
