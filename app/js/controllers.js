'use strict';

/* Controllers */

angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal', function($scope, Zaehlerjournal) {
    $scope.name = 'Übersicht';

    $scope.adressen = Zaehlerjournal.query();

    $scope.version = '0.1';
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
