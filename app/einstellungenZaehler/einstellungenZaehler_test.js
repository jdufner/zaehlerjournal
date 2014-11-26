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
  beforeEach(module('zaehlerjournal.einstellungenZaehler'));
  beforeEach(module('zaehlerjournal.services'));

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

});
