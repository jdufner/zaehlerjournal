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
  .controller('EinstellungenAdresseCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'Konstanten',
    function($scope, $routeParams, Zaehlerjournal, Konstanten) {
    $scope.metadaten = Konstanten.query();
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
    for (var i = 0; i < $scope.immobilien.length; i++) {
      for (var j = 0; j < $scope.immobilien[i].zaehlers.length; j++) {
        for (var k = 0; k < $scope.immobilien[i].zaehlers[j].zaehlerstaende.length; k++) {
          $scope.immobilien[i].zaehlers[j].aktuellerZaehlerstand = 0;
          var zaehlerstand = parseFloat($scope.immobilien[i].zaehlers[j].zaehlerstaende[k].stand);
          //console.log(zaehlerstand);
          if ($scope.immobilien[i].zaehlers[j].aktuellerZaehlerstand < zaehlerstand) {
            $scope.immobilien[i].zaehlers[j].aktuellerZaehlerstand = zaehlerstand;
          }
        }
      }
    }
  }])
;
