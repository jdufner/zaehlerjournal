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

  it('should exists', inject(function($controller) {
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

  it('should exists', inject(function($controller) {
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
    it('should create "adresse" and empty adresse in scope', function() {
      scope.adresse = 'Kaiserstr. 1, Frankfurt';
      scope.createAdresse();
      expect(scope.adresse).toEqual(null);
      expect(Zaehlerjournal.addImmobilie).toHaveBeenCalled();
    });
  });

//  it('should exists', inject(function($controller) {
//    //spec body
//    var detailsCtrl = $controller('DetailsCtrl', { $scope: {}, $routeParams: {}});
//    expect(detailsCtrl).toBeDefined();
//  }));
//
//  describe('DetailsCtrl', function() {
//    var $httpBackend, scope, routeParams, ctrl;
//
//    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
//
//      $httpBackend = _$httpBackend_;
//      $httpBackend.expectGET('zaehler/04AB019104.json').
//        respond([{'datum': '2014-08-01T12:00:00', 'stand': 12345.6}]);
//      routeParams = {'zaehlerNr': '04AB019104'};
//      scope = $rootScope.$new();
//      ctrl = $controller('DetailsCtrl', {$scope: scope, $routeParams: routeParams});
//    }));
//
//    it('should create "Zaehlerstand" model with 1 "Zaehlerstand" fetched from xhr', function() {
//      expect(scope.zaehlerNr).toBe('04AB019104');
//      expect(scope.staende).toEqualData([]);
//      $httpBackend.flush();
//      expect(scope.staende).toEqualData([{'datum': new Date('2014-08-01T12:00:00'), 'stand': 12345.6}]);
//    });
//
//  });

});
