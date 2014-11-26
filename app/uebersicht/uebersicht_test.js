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
  beforeEach(module('zaehlerjournal.uebersicht'));
  beforeEach(module('zaehlerjournal.services'));

  it('UebersichtCtrl 1 should exists', inject(function($controller) {
    //spec body
    var uebersichtCtrl = $controller('UebersichtCtrl', { $scope: {} });
    expect(uebersichtCtrl).toBeDefined();
  }));

  describe('UebersichtCtrl', function() {
    var scope, ctrl, Zaehlerjournal, persistanceService;
    beforeEach(module('zaehlerjournal.services', function() {
      persistanceService = {
        getDataNew: function() {}
      };
      spyOn(persistanceService, 'getDataNew');
    }));
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('UebersichtCtrl', {$scope: scope, Zaehlerjournal: Zaehlerjournal, persistanceService: persistanceService});
    }));
    it('should call persistanceService', function() {
      expect(ctrl).toBeDefined();
      expect(persistanceService.getDataNew).toHaveBeenCalled();
    });
  });

  it('UebersichtCtrl 2 should exists', inject(function($controller) {
    //spec body
    var uebersichtCtrl = $controller('UebersichtCtrl', {$scope: {}, Zaehlerjournal: {getImmobilien: function(){}}});
    expect(uebersichtCtrl).toBeDefined();
  }));

  describe('UebersichtCtrl', function() {
    var scope, ctrl, Zaehlerjournal, persistanceService;
    beforeEach(module('zaehlerjournal.services', function() {
      Zaehlerjournal = {
        getImmobilien: function() {},
        setImmobilien: function() {}
      };
      spyOn(Zaehlerjournal, 'getImmobilien').andReturn([{adresse: 'Strasse Hausnummer Ort'}]);
      spyOn(Zaehlerjournal, 'setImmobilien');
      persistanceService = {
        getDataNew: function() {}
      };
      spyOn(persistanceService, 'getDataNew').andCallFake(
        function(f) {
          //console.log('fake call getDataNew ' + f);
          f([{adresse: 'Strasse Hausnummer Ort'}]);
        }
      );
    }));
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('UebersichtCtrl', {$scope: scope, Zaehlerjournal: Zaehlerjournal, persistanceService: persistanceService});
    }));
    it('should display all immobilien', function() {
      expect(ctrl).toBeDefined();
      //expect(Zaehlerjournal.getImmobilien).toHaveBeenCalled();
      expect(persistanceService.getDataNew).toHaveBeenCalled();
      expect(scope.immobilien.length).toBe(1);
      expect(scope.immobilien[0].adresse).toBe('Strasse Hausnummer Ort');
    });
  });


});
