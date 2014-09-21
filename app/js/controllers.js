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
    $scope.metadaten = Konstanten.query();
    $scope.adresse = $routeParams.adresse;
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.saveImmobilie = function() {
      console.dir($scope.zaehler);
      Zaehlerjournal.addZaehler($scope.adresse, $scope.zaehler);
      $scope.zaehler = null;
      $scope.EinstellungenAdresseForm.$setPristine();
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
  }])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal',
    function($scope, Zaehlerjournal) {
    //$scope.adressen = Zaehlerjournal.query();
    $scope.immobilien = Zaehlerjournal.getImmobilien();
  }])
;
