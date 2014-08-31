'use strict';

/* Controllers */

angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal', function($scope, Zaehlerjournal) {
    $scope.name = 'Übersicht';
    $scope.adressen = Zaehlerjournal.query();
    $scope.version = '0.1';
  }])
  .controller('DetailsCtrl', ['$scope', '$routeParams', 'Zaehlerdetails', function($scope, $routeParams, Zaehlerdetails) {
    $scope.zaehlerNr = $routeParams.zaehlerNr;
    $scope.staende = Zaehlerdetails.query({zaehlerNr: $routeParams.zaehlerNr}, function(zaehlerstaende) {
      // Callbackfunktion nach laden der Zaehlerstände
    });
  }]);
