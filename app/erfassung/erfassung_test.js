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
  beforeEach(module('zaehlerjournal.erfassung'));
  beforeEach(module('zaehlerjournal.services'));

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
    describe('.remove()', function() {
      var zaehlerstand1, zaehlerstand2, zaehler1, zaehler2;
      beforeEach(function() {
        zaehlerstand1 = {stand: 1, datum: 2};
        zaehlerstand2 = {stand: 3, datum: 4};
        zaehler1 = {aktuellerZahlerstand: 1, aktuellerZaehlerstandDatum: 2, zaehlerstaende: [zaehlerstand1]}
        zaehler2 = {aktuellerZahlerstand: 3, aktuellerZaehlerstandDatum: 4, zaehlerstaende: [zaehlerstand1, zaehlerstand2]};
        scope.immobilie = {zaehlers: [zaehler1, zaehler2]};
      });
      it('should remove a zaehlerstand1 from zaehler1', function() {
        scope.remove(zaehler1, zaehlerstand1);
        expect(zaehler1.zaehlerstaende.length).toBe(0);
      });
      it('should remove a zaehlerstand1 from zaehler2', function() {
        scope.remove(zaehler2, zaehlerstand1);
        expect(zaehler2.zaehlerstaende.length).toBe(1);
        expect(zaehler2.aktuellerZaehlerstand).toBe(3);
        expect(zaehler2.aktuellerZaehlerstandDatum).toBe(4);
      });
      it('should remove a zaehlerstand2 from zaehler2', function() {
        scope.remove(zaehler2, zaehlerstand2);
        expect(zaehler2.zaehlerstaende.length).toBe(1);
        expect(zaehler2.aktuellerZaehlerstand).toBe(1);
        expect(zaehler2.aktuellerZaehlerstandDatum).toBe(2);
      });
    });
  });

});
