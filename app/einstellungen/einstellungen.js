/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('zaehlerjournal.einstellungen', ['ngRoute', 'zaehlerjournal.services'])

/* Routing */
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/einstellungen', {templateUrl: 'einstellungen/einstellungen.html', controller: 'EinstellungenCtrl'});
}])

/* Controller */
.controller('EinstellungenCtrl', ['$scope', '$location', 'Zaehlerjournal', 'persistanceService',
  function($scope, $location, Zaehlerjournal, persistanceService) {
    //console.log('init EinstellungenCtrl');
    persistanceService.getConfiguration(function(configuration) {
      $scope.configuration = configuration;
    });
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    persistanceService.getDataNew(function(immobilien) {
      $scope.immobilien = immobilien;
      Zaehlerjournal.setImmobilien($scope.immobilien);
    });
    $scope.createAdresse = function() {
      //console.log('EinstellungenCtrl.createAdresse');
      Zaehlerjournal.addImmobilie($scope.adresse);
      persistanceService.saveData($scope.immobilien);
      $scope.adresse = null;
      $scope.EinstellungenForm.$setPristine();
    };
    $scope.edit = function(immobilie) {
      //console.log('EinstellungenCtrl.edit(' + immobilie.adresse + ')');
      $location.path('/zaehler/' + immobilie.adresse);
    };
    $scope.remove = function(immobilie) {
      //console.log('EinstellungenCtrl.remove(' + immobilie.adresse + ')');
      var anzahl = $scope.immobilien.length;
      var tmp = new Array();
      for (var i = 0; i < anzahl; i++) {
        var immo = $scope.immobilien.pop();
        if (immobilie !== immo) {
          tmp.push(immo);
        };
      };
      for (var i = 0; i < anzahl - 1; i++) {
        $scope.immobilien.push(tmp.pop());
      };
      persistanceService.deleteData(immobilie);
    };
    $scope.saveConfig = function() {
      console.log('EinstellungenCtrl.saveConfig()');
      $scope.configuration.id = 1;
      //console.dir($scope.configuration);
      persistanceService.saveConfiguration($scope.configuration);
    };
  }
])
;
