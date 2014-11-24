'use strict';

/* Controllers */
angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
.controller('EinstellungenCtrl', ['$scope', '$location', 'Zaehlerjournal', 'persistanceService',
  function($scope, $location, Zaehlerjournal, persistanceService) {
    //console.log('init EinstellungenCtrl');
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
      //console.log('/zaehler/' + immobilie.adresse);
      $location.path('/zaehler/' + immobilie.adresse);
    };
    $scope.remove = function(immobilie) {
      console.log('EinstellungenCtrl.remove(' + immobilie.adresse + ')');
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
  }
])
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
.controller('ErfassungCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'persistanceService',
  function($scope, $routeParams, Zaehlerjournal, persistanceService){
    //console.log('init ErfassungCtrl');
    $scope.adresse = $routeParams.adresse;
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.saveZaehler = function() {
      //console.dir($scope.immobilie.zaehlers);
      Zaehlerjournal.addZaehlerstand($scope.immobilie.zaehlers);
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        $scope.immobilie.zaehlers[i].zaehlerstand = null;
      };
      $scope.form.$setPristine();
      persistanceService.saveData($scope.immobilien);
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
        if ($scope.immobilie.zaehlers[i].zaehlerstand !== null &&
            $scope.immobilie.zaehlers[i].zaehlerstand < $scope.immobilie.zaehlers[i].aktuellerZaehlerstand) {
          return true;
        };
      };
      return false;
    };
  }
])
.controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal', 'persistanceService',
  function($scope, Zaehlerjournal, persistanceService) {
    persistanceService.getDataNew(function(immobilien) {
      $scope.immobilien = immobilien;
      Zaehlerjournal.setImmobilien($scope.immobilien);
    });
  }
])
;
