'use strict';

/* Controllers */
angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
  .controller('EinstellungenCtrl', ['$scope', 'Zaehlerjournal', function($scope, Zaehlerjournal) {
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.createAdresse = function() {
      //if (angular.isDefined($scope.adresse) && $scope.adresse != null && $scope.adresse.length > 0) {
        Zaehlerjournal.addImmobilie($scope.adresse);
        $scope.adresse = null;
        $scope.immobilien = Zaehlerjournal.getImmobilien();
      //};
      $scope.EinstellungenForm.$setPristine();
    };
  }])
  .controller('EinstellungenAdresseCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'Konstanten',
    function($scope, $routeParams, Zaehlerjournal, Konstanten) {
    //console.log('init EinstellungenAdresseCtrl');
    //$scope.metadaten = Zaehlerjournal.getKonstanten();
    $scope.metadaten = Zaehlerjournal.getMetadaten();
    //console.dir($scope.metadaten);
    $scope.adresse = $routeParams.adresse;
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    //console.dir($scope.immobilie);
    $scope.saveImmobilie = function() {
      //console.log("saveImmobilie")
      //console.dir($scope.zaehler);
      //console.dir($scope.immobilie);
      if (angular.isUndefined($scope.immobilie.zaehlers)) {
        $scope.immobilie.zaehlers = new Array();
      }
      $scope.zaehler.id = $scope.immobilie.zaehlers.length;
      $scope.immobilie.zaehlers.push($scope.zaehler);
      //Zaehlerjournal.addZaehler($scope.adresse, angular.copy($scope.zaehler));
      $scope.zaehler = null;
      //EinstellungenAdresseForm.reset();
      $scope.EinstellungenAdresseForm.$setPristine();
    };
    $scope.edit = function(zaehlerId) {
      //console.log("edit: " + zaehlerId + " string=" + angular.isString(zaehlerId));
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        //console.dir($scope.immobilie.zaehlers[i]);
        if ($scope.immobilie.zaehlers[i].id === zaehlerId) {
          $scope.zaehler = $scope.immobilie.zaehlers[i];
        };
      };
      console.log("Z�hler gefunden? " + angular.toJson($scope.zaehler));
      //console.dir($scope.zaehler);
    };
  }])
  .controller('ErfassungCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'persistanceService',
    function($scope, $routeParams, Zaehlerjournal, persistanceService){
    $scope.adresse = $routeParams.adresse;
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.saveZaehler = function() {
      //console.dir($scope.immobilie.zaehlers);
      Zaehlerjournal.addZaehlerstand($scope.immobilie, $scope.immobilie.zaehlers);
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        $scope.immobilie.zaehlers[i].zaehlerstand = null;
      };
      //console.log(persistanceService.isSupported());
      //persistanceService.saveData($scope.zaehler);
      $scope.form.$setPristine();
    };
    $scope.isAtLeastOneZaehlerInvalid = function() {
      if ($scope.immobilie === null || $scope.immobilie.zaehlers === null) {
        return true;
      };
      var invalid = true;
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i].zaehlerstand != null) {
          invalid = false;
        };
      };
      if (invalid) {
        return true;
      };
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i].zaehlerstand != null && $scope.immobilie.zaehlers[i].zaehlerstand < $scope.immobilie.zaehlers[i].aktuellerZaehlerstand) {
          return true;
        };
      };
      return false;
    };
  }])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal',
    function($scope, Zaehlerjournal) {
    //$scope.adressen = Zaehlerjournal.query();
    $scope.immobilien = Zaehlerjournal.getImmobilien();
  }])
;
