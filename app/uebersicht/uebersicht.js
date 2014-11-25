'use strict';

angular.module('zaehlerjournal.uebersicht', ['ngRoute', 'zaehlerjournal.services'])

/* Routing */
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uebersicht', {templateUrl: 'uebersicht/uebersicht.html', controller: 'UebersichtCtrl'});
}])

/* Controller */
.controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal', 'persistanceService',
  function($scope, Zaehlerjournal, persistanceService) {
    persistanceService.getDataNew(function(immobilien) {
      $scope.immobilien = immobilien;
      Zaehlerjournal.setImmobilien($scope.immobilien);
    });
  }
])
;
