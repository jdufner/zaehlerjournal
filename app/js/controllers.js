'use strict';

/* Controllers */
angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
  .controller('EinstellungenCtrl', ['$scope', 'Zaehlerjournal', function($scope, Zaehlerjournal) {
    //console.log('init EinstellungenCtrl');
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.createAdresse = function() {
      Zaehlerjournal.addImmobilie($scope.adresse);
      $scope.adresse = null;
      $scope.EinstellungenForm.$setPristine();
    };
  }])
  .controller('EinstellungenAdresseCtrl', ['$scope', '$routeParams', 'Zaehlerjournal',
    function($scope, $routeParams, Zaehlerjournal) {
    console.log('init EinstellungenAdresseCtrl');
    $scope.adresse = $routeParams.adresse;
    $scope.metadaten = Zaehlerjournal.getMetadaten();
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
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    if (angular.isDefined($scope.immobilie) && $scope.immobilie !== null) {
      $scope.zaehlers = $scope.immobilie.zaehlers;
    };
    $scope.save = function() {
      //console.log("save")
      console.dir($scope.zaehler);
      if (angular.isDefined($scope.zaehler.id) || $scope.zaehler.id >= 0) {
        $scope.zaehler = null;
        $scope.EinstellungenAdresseForm.$setPristine();
      } else {
        var maxId = 0;
        for (var i = 0; i < $scope.zaehlers.length; i++) {
          if (maxId <= $scope.zaehlers[i].id) {
            maxId = $scope.zaehlers[i].id;
          };
        };
        $scope.zaehler.id = maxId + 1;
        $scope.zaehler.aktuellerZaehlerstand = 0.0;
        $scope.zaehler.zaehlerstaende = [];
        $scope.zaehlers.push($scope.zaehler);
        $scope.zaehler = null;
        $scope.EinstellungenAdresseForm.$setPristine();
      };
    };
    $scope.edit = function(zaehler) {
      console.log("edit");
      $scope.zaehler = zaehler;
      console.dir($scope.zaehler);
    };
    $scope.remove = function(zaehler) {
      var tmpZaehlers = new Array();
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i] !== zaehler) {
          tmpZaehlers.push($scope.immobilie.zaehlers[i]);
        };
      };
      var anzahl = $scope.immobilie.zaehlers.length;
      for (var i = 0; i < anzahl; i++) {
        //console.log($scope.immobilie.zaehlers.length);
        $scope.immobilie.zaehlers.pop();
      }; 
      for (var i = 0; i < tmpZaehlers.length; i++) {
        $scope.immobilie.zaehlers.push(tmpZaehlers[i]);
      };
    };
    $scope.up = function(zaehler) {
      //console.log("edit: " + angular.toJson(zaehler));
      $scope.zaehler = zaehler;
      //console.dir($scope.zaehler);
    };
    $scope.down = function(zaehler) {
      //console.log("edit: " + angular.toJson(zaehler));
      $scope.zaehler = zaehler;
      //console.dir($scope.zaehler);
    };
  }])
  .controller('EinstellungenZaehlerCtrl', ['$scope', '$routeParams', 'Zaehlerjournal',
    function($scope, $routeParams, Zaehlerjournal) {
    console.log('init EinstellungenZaehlerCtrl');
    $scope.adresse = $routeParams.adresse;
    $scope.metadaten = Zaehlerjournal.getMetadaten();
    $scope.zaehlers = new Array();
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
      console.dir($scope.zaehler);
      if (angular.isDefined($scope.zaehler.id)) {
        
      } else {
        $scope.zaehler.id = $scope.zaehlers.length + 1;
        $scope.zaehlers.push($scope.zaehler);
      }
      $scope.zaehler = null;
      $scope.EinstellungenZaehlerForm.$setPristine();
    };
    $scope.edit = function(zaehler) {
      console.dir(zaehler);
      $scope.zaehler = zaehler;
    };
  }])
  .controller('ErfassungCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'persistanceService',
    function($scope, $routeParams, Zaehlerjournal, persistanceService){
    //console.log('init ErfassungCtrl');
    $scope.adresse = $routeParams.adresse;
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.saveZaehler = function() {
      //console.dir($scope.immobilie.zaehlers);
      Zaehlerjournal.addZaehlerstand($scope.immobilie, $scope.immobilie.zaehlers);
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        $scope.immobilie.zaehlers[i].zaehlerstand = null;
      };
      $scope.form.$setPristine();
    };
    $scope.isAtLeastOneZaehlerInvalid = function() {
      if ($scope.immobilie === null || $scope.immobilie.zaehlers === null) {
        return true;
      };
      var invalid = true;
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i].zaehlerstand !== null) {
          invalid = false;
        };
      };
      if (invalid) {
        return true;
      };
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i].zaehlerstand !== null && $scope.immobilie.zaehlers[i].zaehlerstand < $scope.immobilie.zaehlers[i].aktuellerZaehlerstand) {
          return true;
        };
      };
      return false;
    };
  }])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal',
    function($scope, Zaehlerjournal) {
    $scope.immobilien = Zaehlerjournal.getImmobilien();
  }])
;
