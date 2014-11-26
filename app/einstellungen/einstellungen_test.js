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
  beforeEach(module('zaehlerjournal.einstellungen'));
  beforeEach(module('zaehlerjournal.services'));

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

});
