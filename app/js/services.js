'use strict';

/* Services */

// Demonstrate how to register services
var zaehlerjournalServices = angular.module('zaehlerjournal.services', ['ngResource']);

//
zaehlerjournalServices.factory('Zaehlerjournal', ['$resource', '$http',
  function($resource, $http) {
    var immobilien = [];
    var konstanten = null;
    var metadaten = null;
    function getImmobilien() {
      return immobilien;
    };
    function addImmobilie(adresse) {
      //console.dir(adresse);
      immobilien.push({'id': immobilien.length, 'adresse': adresse});
      //console.dir(immobilien);
    };
    function findImmobilieByAdresse(adresse) {
      for (var i = 0; i < immobilien.length; i++) {
        if (immobilien[i].adresse === adresse) {
          //console.log('i=' + i + ', ' + immobilien[i]);
          return immobilien[i];
        }
      };
      return null;
    };
    function addZaehler(adresse, zaehler) {
      //console.log(adresse + ', ' + zaehler);
      var immobilie = findImmobilieByAdresse(adresse);
      //console.dir(immobilie);
      if (angular.isUndefined(immobilie.zaehlers)) {
        immobilie.zaehlers = new Array();
      };
      zaehler.zaehlerstaende = new Array();
      zaehler.id = immobilie.zaehlers.length;
      zaehler.aktuellerZaehlerstand = 0.0;
      immobilie.zaehlers.push(zaehler);
      //console.dir(immobilie);
    };
    function addZaehlerstand(immobilie, zaehlers) {
      //console.log(zaehlers);
      for (var i = 0; i < zaehlers.length; i++) {
        if (angular.isUndefined(zaehlers[i].zaehlerstaende)) {
          zaehlers[i].zaehlerstaende = new Array();
        };
        //console.log(zaehlers[i].zaehlerstand);
        if (angular.isUndefined(zaehlers[i].zaehlerstand) || zaehlers[i].zaehlerstand == null) {
          continue;
        }
        var d = new Date();
        zaehlers[i].zaehlerstaende.push({
          'id': zaehlers[i].zaehlerstaende.length,
          'datum': d.format('Y-m-d\\TH:i:s'),
          'stand': zaehlers[i].zaehlerstand
        });
        zaehlers[i].aktuellerZaehlerstand = zaehlers[i].zaehlerstand;
      };
    };
    function getKonstanten() {
      if (konstanten == null) {
        konstanten = {
          "art": {
              "name": "Art",
              "werte": [{
                "id": 0,
                "art": "Fernwärme",
                "einheit": "kWh"
              }, {
                "id": 1,
                "art": "Gas",
                "einheit": "m³"
              }, {
                "id": 2,
                "art": "Solarstrom",
                "einheit": "kWh"
              }, {
                "id": 3,
                "art": "Strom",
                "einheit": "kWh"
              }, {
                "id": 4,
                "art": "Wasser",
                "einheit": "m³"
              }]
          },
          "typ": {
              "name": "Typ",
              "werte": [{
                "id": 0,
                "art": "Hauptzähler"
              }, {
                "id": 1,
                "art": "Nebenzähler"
              }]
          }
        };
      };
      return konstanten;
    };
    function getMetadaten() {
      if (metadaten === null) {
        $http.get('zaehler/konstanten.json').then(
        function(response) {
          //console.dir(response.data);
          metadaten = response.data;
        });
      };
      return metadaten;
    };
    return {
      addImmobilie: addImmobilie,
      addZaehler: addZaehler,
      addZaehlerstand: addZaehlerstand,
      findImmobilieByAdresse: findImmobilieByAdresse,
      getImmobilien: getImmobilien,
      getKonstanten: getKonstanten,
      getMetadaten: getMetadaten
    }
  }
]);

zaehlerjournalServices.factory('Konstanten', ['$resource',
  function($resource) {
    return $resource('zaehler/konstanten.json', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: false
      }
    });
  }
]);

zaehlerjournalServices.factory('persistanceService', ['$q',
  function($q) {
    var setUp = false;
    var db;

    var testObj = {
      "adresse": "An der Tuchbleiche 6, Biebesheim",
      "zaehlers": [{"nr": "19080458", "art": "Gas", "typ": "Hauptzähler", "einheit": "m³"},
                   {"nr": "04AB019104", "art": "Wasser", "typ": "Hauptzähler", "einheit": "m³"},
                   {"nr": "3650005100260", "art": "Strom", "typ": "Hauptzähler", "einheit": "kWh"}]
    };

    /**
     * Initialisiert die Datenbank.
     */
    function init() {
      var deferred = $q.defer();

      if (setUp) {
        deferred.resolve(true);
        return deferred.promise;
      };

      var openRequest = window.indexedDB.open("zaehlerjournalDb", 1);

      openRequest.onerror = function(e) {
        console.log("Error opening Database");
        console.dir(e);
        deferred.reject(e.toString());
      };

      openRequest.onupgradeneeded = function(e) {
        console.log("Database opened, need upgrade");
        var thisDb = e.target.result;
        var objectStore;
        if(!thisDb.objectStoreNames.contains("zaehlerjournal")) {
          objectStore = thisDb.createObjectStore("zaehlerjournal", {keyPath: "id", autoIncrement:true});
          //objectStore.createIndex("adressen", "adressen", {unique: false});
          //objectStore.createIndex("tags", "tags", {unique:false, multiEntry:true});
        };
      };

      openRequest.onsuccess = function(e) {
        console.log("Database successfully opened");
        db = e.target.result;
        db.onerror = function(event) {
          deferred.reject("Database error: " + event.target.errorCode);
        };
        setUp = true;
        deferred.resolve(true);
      };

      return deferred.promise;
    };

    /**
     * Liefert true, wenn IndexedDB unterstützt wird, sonst false.
     */
    function isSupported() {
      return "indexedDB" in window;
    }

    /**
     *
     */
    function getData() {
      var deferred = $q.defer();

      init().then(
        // successCallback
        function() {

          var result = [];

          var handleResult = function(event) {
            var cursor = event.target.result;
            if (cursor) {
              result.push({key: cursor.key, title: cursor.value.title, updated: cursor.value.updated});
              cursor.contine();
            }
          };

          var transaction = db.transaction();
          var objectStore = transaction.objectStore('zaehlerjournal');
          objectStore.openCursor().onsuccess = handleResult;
          transaction.oncomplete = function(event) {
            deferred.resolve(result);
          };
        } //, errorCallack, notifyCallback
      );

      return deferred.promise;
    };

    /**
     *
     */
    function saveData(zaehler) {
      var deferred = $q.defer();

      init().then(
        // successCallback
        function() {

          var handleResult = function(event) {
            console.dir('Object ' + event.target.result + ' saved.');
          };

          var transaction = db.transaction(['zaehlerjournal'], 'readwrite');
          var objectStore = transaction.objectStore('zaehlerjournal');
          var request = objectStore.put(zaehler);
          request.onsuccess = handleResult;
        } //, errorCallback, notifyCallback
      );
    };

    // Liefert den Service als Objekt zurück.
    return {
      init: init,
      isSupported: isSupported,
      getData: getData,
      saveData: saveData
    };
  }
]);
