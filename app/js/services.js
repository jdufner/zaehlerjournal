'use strict';

/* Services */

// Demonstrate how to register services
var zaehlerjournalServices = angular.module('zaehlerjournal.services', ['ngResource']);

//
zaehlerjournalServices.factory('Zaehlerjournal', ['$http',
  function($http) {
    var immobilien = [];
    var metadaten = null;
    function getImmobilien() {
      return immobilien;
    };
    function setImmobilien(pImmobilien) {
      immobilien = pImmobilien;
//      for (var i = 0; i < immobilien.length; i++) {
//        for (var j = 0; j < immobilien[i].zaehlers.length; j++) {
//          var maxDatum = 0;
//          for (var k = 0; k < immobilien[i].zaehlers[j].zaehlerstaende.length; k++) {
//            if (maxDatum < immobilien[i].zaehlers[j].zaehlerstaende[k].datum) {
//              maxDatum = immobilien[i].zaehlers[j].zaehlerstaende[k].datum;
//            };
//          };
//          immobilien[i].zaehlers[j].aktuellerZaehlerstandDatum = maxDatum;
//        };
//      };
    };
    function addImmobilie(adresse) {
      immobilien.push({'id': immobilien.length + 1, 'adresse': adresse, zaehlers: []});
    };
    function findImmobilieByAdresse(adresse) {
      for (var i = 0; i < immobilien.length; i++) {
        if (angular.isDefined(immobilien[i].adresse) && immobilien[i].adresse === adresse) {
          return immobilien[i];
        };
      };
      return null;
    };
    function addZaehlerstand(zaehlers) {
      //console.log(zaehlers);
      for (var i = 0; i < zaehlers.length; i++) {
        if (angular.isUndefined(zaehlers[i].zaehlerstaende)) {
          zaehlers[i].zaehlerstaende = new Array();
        };
        //console.log(zaehlers[i].zaehlerstand);
        if (angular.isUndefined(zaehlers[i].zaehlerstand) || zaehlers[i].zaehlerstand === null) {
          continue;
        }
        var d = new Date();
        zaehlers[i].zaehlerstaende.push({
          'id': zaehlers[i].zaehlerstaende.length,
          'datum': d.getTime(),
          'stand': zaehlers[i].zaehlerstand
        });
        zaehlers[i].aktuellerZaehlerstand = zaehlers[i].zaehlerstand;
        zaehlers[i].aktuellerZaehlerstandDatum = d.getTime();
      };
    };
    /**
     * Liefert die Metadaten, falls bereits geladen synchron zurück, ansonsten
     * werden die Metadaten asynchron geladen und NULL zurückgeliefert.
     */
    function getMetadaten() {
      //console.log('zaehlerjournalServices.getMetadaten');
      return metadaten;
    };
    function loadMetadaten() {
      //console.log('zaehlerjournalServices.loadMetadaten');
      return $http.get('zaehler/konstanten.json');
    };
    function setMetadaten(daten) {
      //console.log('zaehlerjournalServices.setMetadaten');
      metadaten = daten;
    };
    return {
      addImmobilie: addImmobilie,
      addZaehlerstand: addZaehlerstand,
      findImmobilieByAdresse: findImmobilieByAdresse,
      getImmobilien: getImmobilien,
      getMetadaten: getMetadaten,
      loadMetadaten: loadMetadaten,
      setImmobilien: setImmobilien,
      setMetadaten: setMetadaten
    };
  }
]);

zaehlerjournalServices.factory('persistanceService', ['$q',
  function($q) {
    var setUp = false;
    var db;

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
          objectStore = thisDb.createObjectStore("zaehlerjournal", {keyPath: "id", autoIncrement:false});
          objectStore.createIndex("adressen", "adresse", {unique: false});
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
            //console.dir(event);
            var cursor = event.target.result;
            if (cursor) {
              //console.dir(cursor.value);
              result.push(cursor.value);
              cursor.continue();
            }
          };
          var transaction = db.transaction(['zaehlerjournal'], 'readonly');
          var objectStore = transaction.objectStore('zaehlerjournal');
          objectStore.openCursor().onsuccess = handleResult;
          transaction.oncomplete = function(event) {
            deferred.resolve(result);
          };
        } //, errorCallback, notifyCallback
      );
      return deferred.promise;
    };

    /**
     *
     */
    function getDataNew(callbackFunction) {
      init().then(
        getData().then(
          function(response) {
            callbackFunction(response);
          }
        )
      );
    };

    /**
     *
     */
    function getDataByAdresse(adresse) {
      var deferred = $q.defer();
      init().then(
        // successCallback
        function() {
          var result = null;
          var handleResult = function(event) {
            console.log('getDataByAdresse');
            console.dir(event);
            result = event.target.result;
          };
          var transaction = db.transaction(['zaehlerjournal'], 'readonly');
          var objectStore = transaction.objectStore('zaehlerjournal');
          //console.log('Indexnames');
          //console.dir(objectStore.indexNames);
          var index = objectStore.index('adressen');
          index.get(adresse).onsuccess = handleResult;
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
    function saveData(immobilien) {
      var deferred = $q.defer();
      init().then(
        // successCallback
        function(event) {
          var handleResult = function(event) {
            console.log('Object ' + event.target.result + ' saved.');
          };
          var transaction = db.transaction(['zaehlerjournal'], 'readwrite');
          var objectStore = transaction.objectStore('zaehlerjournal');
          for (var i = 0; i < immobilien.length; i++) {
            var request = objectStore.put(immobilien[i]);
            request.onsuccess = handleResult;
          }
        },
        // errorCallback
        function(event) {
          console.log('Fehler beim Speichern!');
          console.dir(event);
        }
        // , notifyCallback
      );
    };

    // Liefert den Service als Objekt zurück.
    return {
      //init: init,
      //isSupported: isSupported,
      getData: getData,
      getDataNew: getDataNew,
      getDataByAdresse: getDataByAdresse,
      saveData: saveData
    };
  }
]);
