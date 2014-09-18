'use strict';

/* Services */

// Demonstrate how to register services
var zaehlerjournalServices = angular.module('zaehlerjournal.services', ['ngResource']);

// In this case it is a simple value service.
zaehlerjournalServices.value('version', '0.1');

//
zaehlerjournalServices.factory('Zaehlerjournal', ['$resource',
  function($resource) {
    var immobilien = [];
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
      immobilie.zaehlers.push(angular.copy(zaehler));
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
        //console.dir(d);
        //console.log(d.toLocaleString());
        //console.log(d.getTimezoneOffset());
        zaehlers[i].zaehlerstaende.push({
          'id': zaehlers[i].zaehlerstaende.length,
          'datum': d.toLocaleString(),
          'stand': zaehlers[i].zaehlerstand
        });
      };
    };
    return {
      addImmobilie: addImmobilie,
      addZaehler: addZaehler,
      addZaehlerstand: addZaehlerstand,
      findImmobilieByAdresse: findImmobilieByAdresse,
      getImmobilien: getImmobilien
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
