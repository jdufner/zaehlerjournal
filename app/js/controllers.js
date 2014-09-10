'use strict';

/* Controllers */
angular.module('zaehlerjournal.controllers', ['zaehlerjournal.services'])
  .controller('DetailsCtrl', ['$scope', '$routeParams', 'Zaehlerdetails', function($scope, $routeParams, Zaehlerdetails) {
    $scope.zaehlerNr = $routeParams.zaehlerNr;
    $scope.staende = Zaehlerdetails.query({zaehlerNr: $routeParams.zaehlerNr}, function(zaehlerstaende) {
      // Callbackfunktion nach dem Laden der Zaehlerstände
      for (var i = 0; i < zaehlerstaende.length; i++) {
        // Wandle String in Date-Objekt
        zaehlerstaende[i].datum = new Date(zaehlerstaende[i].datum);
      }
    });
  }])
  .controller('EinstellungenCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', function($scope, $routeParams, Zaehlerjournal) {
    $scope.einstellungen = {
      'arten': [{
        'art': 'Fernwärme',
        'einheit': 'kWh'
      }, {
        'art': 'Gas',
        'einheit': 'm³'
      }, {
        'art': 'Solarstrom',
        'einheit': 'kWh'
      }, {
        'art': 'Strom',
        'einheit': 'kWh'
      }, {
        'art': 'Wasser',
        'einheit': 'm³'
      }],
      'typen': ['Hauptzähler', 'Nebenzähler']
    };
    $scope.adressen = Zaehlerjournal.getAdressen();
    console.log($routeParams.adresse);
    $scope.createAdresse = function() {
      if (angular.isDefined($scope.adresse) &&  $scope.adresse.length > 0) {
        Zaehlerjournal.addAdresse($scope.adresse);
        $scope.adresse = null;
        $scope.adressen = Zaehlerjournal.getAdressen();
      };
    };
  }])
  .controller('ErfassungCtrl', ['$scope', 'persistanceService',
    function($scope, persistanceService){

    $scope.zaehler = {
        "adresse": "An der Tuchbleiche 6, Biebesheim",
        "zaehlers":
        [
            {
                "nr": "19080458",
                "art": "Gas",
                "typ": "Hauptzähler",
                "einheit": "m³",
            },
            {
                "nr": "04AB019104",
                "art": "Wasser",
                "typ": "Hauptzähler",
                "einheit": "m³",
            },
            {
                "nr": "3650005100260",
                "art": "Strom",
                "typ": "Hauptzähler",
                "einheit": "kWh",
            }
        ]
    };
    $scope.speichern = function() {
      console.dir($scope.zaehler.zaehlers);
      console.log(persistanceService.isSupported());
      persistanceService.saveData($scope.zaehler);
    };
  }])
  .controller('UebersichtCtrl', ['$scope', 'Zaehlerjournal',
    function($scope, Zaehlerjournal) {
    $scope.name = 'Übersicht';
    $scope.adressen = Zaehlerjournal.query();
    $scope.version = '0.1';
  }])
;
