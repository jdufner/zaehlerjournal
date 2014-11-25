/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('zaehlerjournal.einstellungenZaehler', ['ngRoute', 'zaehlerjournal.services'])

/* Routing */
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/zaehler/:adresse', {templateUrl: 'einstellungenZaehler/einstellungenZaehler.html', controller: 'EinstellungenZaehlerCtrl'});
}])

/* Controllers */
.controller('EinstellungenZaehlerCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'persistanceService',
  function($scope, $routeParams, Zaehlerjournal, persistanceService) {
    //console.log('init EinstellungenZaehlerCtrl');
    $scope.adresse = $routeParams.adresse;
    $scope.metadaten = Zaehlerjournal.getMetadaten();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.zaehlers = $scope.immobilie.zaehlers;
    if ($scope.metadaten === null) {
      var promise = Zaehlerjournal.loadMetadaten();
      //console.dir(promise);
      promise.then(
        function(response){
          //console.dir(response.data);
          $scope.metadaten = response.data;
          Zaehlerjournal.setMetadaten($scope.metadaten);
        },
        function(reason){
          console.dir(reason);
        }
      );
    };
    $scope.save = function() {
      //console.dir($scope.zaehler);
      var maxId = 0;
      for (var i = 0; i < $scope.zaehlers.length; i++) {
        if (maxId < $scope.zaehlers[i].id) {
          maxId = $scope.zaehlers[i].id;
        };
      };
      if (angular.isUndefined($scope.zaehler.id)) {
        $scope.zaehler.id = maxId + 1;
        $scope.zaehlers.push($scope.zaehler);
      }
      if (angular.isUndefined($scope.zaehler.aktuellerZaehlerstand)) {
        $scope.zaehler.aktuellerZaehlerstand = 0;
      };
      $scope.zaehler = null;
      $scope.EinstellungenZaehlerForm.$setPristine();
      var immobilien = Zaehlerjournal.getImmobilien();
      persistanceService.saveData(immobilien);
    };
    $scope.edit = function(zaehler) {
      //console.dir(zaehler);
      $scope.zaehler = zaehler;
      var immobilien = Zaehlerjournal.getImmobilien();
      persistanceService.saveData(immobilien);
    };
    $scope.remove = function(zaehler) {
      //console.dir(zaehler);
      var anzahl = $scope.zaehlers.length;
      var tmp = new Array();
      for (var i = 0; i < anzahl; i++) {
        var z = $scope.zaehlers.pop();
        if (zaehler !== z) {
          tmp.push(z);
        };
      };
      for (var i = 0; i < anzahl - 1; i++) {
        $scope.zaehlers.push(tmp.pop());
      };
      var immobilien = Zaehlerjournal.getImmobilien();
      persistanceService.saveData(immobilien);
    };
    $scope.up = function(zaehler) {
      console.dir(zaehler);
      var index;
      for (var i = 0; i < $scope.zaehlers.length; i++) {
        if (zaehler === $scope.zaehlers[i]) {
          index = i;
        };
      };
      if (index === 0) {
        return;
      };
      var tmp = $scope.zaehlers[index - 1];
      $scope.zaehlers[index - 1] = $scope.zaehlers[index];
      $scope.zaehlers[index] = tmp;
      var immobilien = Zaehlerjournal.getImmobilien();
      persistanceService.saveData(immobilien);
    };
    $scope.down = function(zaehler) {
      console.dir(zaehler);
      var index;
      for (var i = 0; i < $scope.zaehlers.length; i++) {
        if (zaehler === $scope.zaehlers[i]) {
          index = i;
        };
      };
      if (index === $scope.zaehlers.length - 1) {
        return;
      };
      var tmp = $scope.zaehlers[index];
      $scope.zaehlers[index] = $scope.zaehlers[index + 1];
      $scope.zaehlers[index + 1] = tmp;
      persistanceService.saveData($scope.immobilien);
    };
  }
])
;
