'use strict';

/* Controllers */

angular.module('zaehlerjournal.controllers', [])
  .controller('UebersichtCtrl', ['$scope', function($scope) {
    $scope.name = 'Übersicht';
    $scope.zaehlers = [
      {
        "nr": "1",
        "art": "Gas"
      },
      {
        "nr": "2",
        "art": "Wasser"
      },
      {
        "nr": "3",
        "art": "Strom"
      }
    ];
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
