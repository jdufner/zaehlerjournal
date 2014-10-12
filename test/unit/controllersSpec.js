'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });
  beforeEach(module('zaehlerjournal.controllers'));
  beforeEach(module('zaehlerjournal.services'));

  it('UebersichtCtrl should exists', inject(function($controller) {
    //spec body
    var uebersichtCtrl = $controller('UebersichtCtrl', { $scope: {} });
    expect(uebersichtCtrl).toBeDefined();
  }));

  describe('UebersichtCtrl', function() {
    var scope, ctrl;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('UebersichtCtrl', {$scope: scope});
    }));
    it('should create "immobilien" model', function() {
      expect(scope.immobilien).toEqualData([]);
    });
  });

  it('EinstellungenCtrl should exists', inject(function($controller) {
    //spec body
    var detailsCtrl = $controller('EinstellungenCtrl', {$scope: {}});
    expect(detailsCtrl).toBeDefined();
  }));

  describe('EinstellungenCtrl', function() {
    var scope, ctrl, Zaehlerjournal;
    beforeEach(module('zaehlerjournal', function($provide) {
      Zaehlerjournal = {
        getImmobilien: function() {},
        addImmobilie: function() {}
      };
      spyOn(Zaehlerjournal, 'getImmobilien').andReturn([]);
      spyOn(Zaehlerjournal, 'addImmobilie').andReturn({});
      $provide.value('Zaehlerjournal', Zaehlerjournal);
    }));
    beforeEach(inject(function($rootScope, $controller) {
      //console.log('beforeEach');
      scope = $rootScope.$new();
      ctrl = $controller('EinstellungenCtrl', {$scope: scope, Zaehlerjournal: Zaehlerjournal});
      scope.EinstellungenForm = {
        $setPristine: function() {}
      };
    }));
    it('should create "immobilien" model', function() {
      //console.log(scope.immobilien);
      expect(scope.immobilien).toEqualData([]);
      expect(Zaehlerjournal.getImmobilien).toHaveBeenCalled();
    });
    it('should create "adresse" in immobilien and empty adresse in scope', function() {
      var adresse = 'Kaiserstr. 1, Frankfurt';
      scope.adresse = adresse;
      scope.createAdresse();
      expect(scope.adresse).toEqual(null);
      expect(Zaehlerjournal.addImmobilie).toHaveBeenCalledWith(adresse);
    });
  });

  it('EinstellungenZaehlerCtrl should exists', inject(function($controller) {
    //spec body
    var einstellungenZaehlerCtrl = $controller('EinstellungenZaehlerCtrl', { 
      $scope: {}
      , $routeParams: {}
      , Zaehlerjournal: { 
        getMetadaten: function() {}
        , findImmobilieByAdresse: function() {
          return { zaehlers: [] };
        }
      }
    });
    expect(einstellungenZaehlerCtrl).toBeDefined();
  }));

  describe('EinstellungenZaehlerCtrl', function() {
    var scope, ctrl, routeParams, Zaehlerjournal;
    beforeEach(module('zaehlerjournal', function($provide) {
      Zaehlerjournal = {
        addImmobilie: function() {}
        , findImmobilieByAdresse: function() {}
        , getImmobilien: function() {}
        , getMetadaten: function() {}
      };
      spyOn(Zaehlerjournal, 'addImmobilie').andReturn({});
      spyOn(Zaehlerjournal, 'findImmobilieByAdresse').andReturn({ adresse: 'Strasse Hausnummer Ort', aktuellerZaehlerstand: 123});
      spyOn(Zaehlerjournal, 'getImmobilien').andReturn([]);
      spyOn(Zaehlerjournal, 'getMetadaten').andReturn({ art: ['Gas', 'Strom', 'Wasser']});
      $provide.value('Zaehlerjournal', Zaehlerjournal);
      routeParams = {
        adresse: 'Strasse Hausnummer Ort'
      };
      $provide.value('$routeParams', routeParams);
    }));
    beforeEach(inject(function($rootScope, $controller, $routeParams, Zaehlerjournal) {
      scope = $rootScope.$new();
      scope.EinstellungenZaehlerForm = {
        $setPristine: function() {}
      };
      ctrl = $controller('EinstellungenZaehlerCtrl', { 
        $scope: scope
        , $routeParams: $routeParams
        , Zaehlerjournal: Zaehlerjournal
      });
    }));
    it('should read adresse from $routeParams and set it in model', function() {
      expect(scope.adresse).toEqualData('Strasse Hausnummer Ort');
    });
    it('should read metadaten from Zaehlerjournal and set it in model', function() {
      expect(scope.metadaten.art[1]).toEqualData('Strom');
    });
    it('should read immobilie by adresse from Zaehlerjournal and set it in model', function() {
      expect(scope.immobilie.adresse).toEqualData('Strasse Hausnummer Ort');
      expect(scope.immobilie.aktuellerZaehlerstand).toEqualData(123);
    });
    it('should save a zaehler', function() {
      var zaehler = {nr: '123', art: 'Gas', typ: 'Haupzähler'};
      scope.zaehler = zaehler;
      scope.zaehlers = new Array();
      expect(scope).toBeDefined();
      expect(scope.zaehler).toBeDefined();
      expect(scope.zaehler).not.toBe(null);
      scope.save();
      expect(scope.zaehler).toBe(null);
      expect(scope.zaehlers).toBeDefined();
      expect(scope.zaehlers).not.toBe(null);
      expect(scope.zaehlers[0]).not.toBe(null);
      expect(scope.zaehlers[0].id).toBeDefined();
      expect(scope.zaehlers[0].id).toBe(1);
      expect(scope.zaehlers[0].aktuellerZaehlerstand).toBeDefined();
      expect(scope.zaehlers[0].aktuellerZaehlerstand).toBe(0);
    });
    it('should edit a zaehler', function() {
      var zaehler = {nr: '123', art: 'Gas', typ: 'Haupzähler'};
      scope.edit(zaehler);
      expect(scope.zaehler).toBeDefined();
      expect(scope.zaehler).not.toBe(null);
      expect(scope.zaehler).toBe(zaehler);
    });
    it('should remove a zaehler', function() {
      var zaehler = {nr: '123', art: 'Gas', typ: 'Haupzähler'};
      scope.zaehlers = new Array();
      scope.zaehlers.push(zaehler);
      scope.remove(zaehler);
      expect(scope.zaehlers).toBeDefined();
      expect(scope.zaehlers.length).toBe(0);
    });
    it('should move up a zaehler', function() {
      scope.zaehlers = new Array();
      var zaehler1 = {id: 1, nr: '123', art: 'Gas', typ: 'Haupzähler'};
      scope.zaehlers.push(zaehler1);
      var zaehler2 = {id: 2, nr: '456', art: 'Wasser', typ: 'Haupzähler'};
      scope.zaehlers.push(zaehler2);
      scope.up(zaehler2);
      expect(scope.zaehlers).toBeDefined();
      expect(scope.zaehlers.length).toBe(2);
      expect(scope.zaehlers[0].id).toBe(2);
      expect(scope.zaehlers[1].id).toBe(1);
    });
    it('should move down a zaehler', function() {
      scope.zaehlers = new Array();
      var zaehler1 = {id: 1, nr: '123', art: 'Gas', typ: 'Haupzähler'};
      scope.zaehlers.push(zaehler1);
      var zaehler2 = {id: 2, nr: '456', art: 'Wasser', typ: 'Haupzähler'};
      scope.zaehlers.push(zaehler2);
      scope.down(zaehler1);
      expect(scope.zaehlers).toBeDefined();
      expect(scope.zaehlers.length).toBe(2);
      expect(scope.zaehlers[0].id).toBe(2);
      expect(scope.zaehlers[1].id).toBe(1);
    });
  });

  it('ErfassungCtrl should exists', inject(function($controller) {
    //spec body
    var erfassungCtrl = $controller('ErfassungCtrl', { $scope: {}, $routeParams: {}});
    expect(erfassungCtrl).toBeDefined();
  }));

  describe('ErfassungCtrl', function() {
    var scope, routeParams, ctrl, Zaehlerjournal;
    beforeEach(module('zaehlerjournal', function($provide) {
      Zaehlerjournal = {
        addZaehlerstand: function() {}
        , findImmobilieByAdresse: function() {}
        , getImmobilien: function() {}
        , saveZaehler: function() {}
      };
      spyOn(Zaehlerjournal, 'addZaehlerstand').andReturn({});
      spyOn(Zaehlerjournal, 'findImmobilieByAdresse').andReturn({ adresse: 'Strasse Hausnummer Ort', aktuellerZaehlerstand: 123, zaehlers: [{id: 1, art: 'Gas', typ: 'Hauptzähler'}]});
      spyOn(Zaehlerjournal, 'getImmobilien').andReturn([]);
      $provide.value('Zaehlerjournal', Zaehlerjournal);
      routeParams = {
        adresse: 'Strasse Hausnummer Ort'
      };
      $provide.value('$routeParams', routeParams);
    }));
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      scope.form = {
        $setPristine: function() {}
      };
      ctrl = $controller('ErfassungCtrl', {$scope: scope, $routeParams: routeParams, Zaehlerjournal: Zaehlerjournal});
    }));
    it('should save all zaehlerstaende of one zaehler', function() {
      scope.immobilie.zaehlers[0].zaehlerstand = 1;
      scope.saveZaehler();
      expect(Zaehlerjournal.addZaehlerstand).toHaveBeenCalled();
      expect(scope.immobilie.zaehlers[0].zaehlerstand).toBe(null);
    });
    it('should check if a immobilie is available', function(){
      scope.immobilie = null;
      var invalid = scope.isAtLeastOneZaehlerInvalid();
      expect(invalid).toBe(true);
    });
    it('should check if a immobilie with one zaehler is available', function(){
      scope.immobilie = {zaehlers: null};
      var invalid = scope.isAtLeastOneZaehlerInvalid();
      expect(invalid).toBe(true);
    });
    it('should check if a immobilie with one zaehler is invalid', function(){
      scope.immobilie = {zaehlers: [{zaehlerstand: null}]};
      var invalid = scope.isAtLeastOneZaehlerInvalid();
      expect(invalid).toBe(true);
    });
    it('should check if a immobilie with one zaehler is valid and smaller than aktuellerZahlerstand', function(){
      scope.immobilie = {zaehlers: [{zaehlerstand: 1, aktuellerZaehlerstand: 2}]};
      var invalid = scope.isAtLeastOneZaehlerInvalid();
      expect(invalid).toBe(true);
    });
    it('should check if a immobilie with one zaehler is valid and greater than aktuellerZahlerstand', function(){
      scope.immobilie = {zaehlers: [{zaehlerstand: 1, aktuellerZaehlerstand: 0}]};
      var invalid = scope.isAtLeastOneZaehlerInvalid();
      expect(invalid).toBe(false);
    });
  });

  it('UebersichtCtlr should exists', inject(function($controller) {
    //spec body
    var uebersichtCtrl = $controller('UebersichtCtrl', {$scope: {}, Zaehlerjournal: {getImmobilien: function(){}}});
    expect(uebersichtCtrl).toBeDefined();
  }));

  describe('UebersichtCtrl', function() {
    var scope, ctrl, Zaehlerjournal;
    beforeEach(module('zaehlerjournal', function() {
      Zaehlerjournal = {
        getImmobilien: function() {}
      };
      spyOn(Zaehlerjournal, 'getImmobilien').andReturn([{adresse: 'Strasse Hausnummer Ort'}]);
    }));
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('UebersichtCtrl', {$scope: scope, Zaehlerjournal: Zaehlerjournal});
    }));
    it('should display all immobilien', function() {
      expect(ctrl).toBeDefined();
      expect(Zaehlerjournal.getImmobilien).toHaveBeenCalled();
      expect(scope.immobilien.length).toBe(1);
      expect(scope.immobilien[0].adresse).toBe('Strasse Hausnummer Ort');
    });
  });
  
});
