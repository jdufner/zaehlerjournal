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
  .controller('EinstellungenCtrl', ['$scope', 'Zaehlerjournal', function($scope, Zaehlerjournal) {
    $scope.adressen = Zaehlerjournal.getAdressen();
    $scope.createAdresse = function() {
      if (angular.isDefined($scope.adresse) &&  $scope.adresse.length > 0) {
        Zaehlerjournal.addAdresse($scope.adresse);
        $scope.adresse = null;
        $scope.adressen = Zaehlerjournal.getAdressen();
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
    $scope.adressen = Zaehlerjournal.getAdressen();
    $scope.saveAdresse = function() {
      console.dir($scope.zaehler);
      Zaehlerjournal.addZaehler($scope.adresse, $scope.zaehler);
    };
    $scope.a = Zaehlerjournal.findAdresseByText($scope.adresse);
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
