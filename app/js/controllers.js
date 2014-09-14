'use strict';

/* Controllers */
angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
  .controller('EinstellungenCtrl', ['$scope', 'Zaehlerjournal', function($scope, Zaehlerjournal) {
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.createAdresse = function() {
      if (angular.isDefined($scope.adresse) &&  $scope.adresse.length > 0) {
        Zaehlerjournal.addImmobilie($scope.adresse);
        $scope.adresse = null;
        $scope.immobilien = Zaehlerjournal.getImmobilien();
      };
    };
  }])
  .controller('EinstellungenAdresseCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', function($scope, $routeParams, Zaehlerjournal) {
    $scope.metadaten = {
      'art': {
        'name': 'Art',
        'werte': [{
          'id': 0,
          'art': 'Fernwärme',
          'einheit': 'kWh'
        }, {
          'id': 1,
          'art': 'Gas',
          'einheit': 'm³'
        }, {
          'id': 2,
          'art': 'Solarstrom',
          'einheit': 'kWh'
        }, {
          'id': 3,
          'art': 'Strom',
          'einheit': 'kWh'
        }, {
          'id': 4,
          'art': 'Wasser',
          'einheit': 'm³'
        }]
      },
      'typ': {
        'name': 'Typ',
        'werte': [{
          'id': 0,
          'art': 'Hauptzähler'
        }, {
          'id': 1,
          'art': 'Nebenzähler'
       }]
      }
    };
    $scope.adresse = $routeParams.adresse;
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.saveImmobilie = function() {
      //console.dir($scope.zaehler);
      Zaehlerjournal.addZaehler($scope.adresse, $scope.zaehler);
      $scope.zaehler = null;
    };
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
  }])
  .controller('ErfassungCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'persistanceService',
    function($scope, $routeParams, Zaehlerjournal, persistanceService){
    $scope.adresse = $routeParams.adresse;
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.saveZaehler = function() {
      //console.log($scope.immobilie.zaehlerstand);
      Zaehlerjournal.addZaehlerstand($scope.immobilie, $scope.immobilie.zaehlers);
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        $scope.immobilie.zaehlers[i].zaehlerstand = null;
      };
      //console.log(persistanceService.isSupported());
      //persistanceService.saveData($scope.zaehler);
    };
  }])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal',
    function($scope, Zaehlerjournal) {
    //$scope.adressen = Zaehlerjournal.query();
    $scope.immobilien = Zaehlerjournal.getImmobilien();
  }])
;
