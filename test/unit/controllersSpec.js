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
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('zaehler/zaehler.json').
        respond([{adresse: 'An der Tuchbleiche 6, Biebesheim'}]);
      scope = $rootScope.$new();
      ctrl = $controller('UebersichtCtrl', {$scope: scope});
    }));

    it('should create "Adresse" model with 3 "Zaehler" fetched from xhr', function() {
      expect(scope.adressen).toEqualData([]);
      $httpBackend.flush();
      expect(scope.adressen).toEqualData([{adresse: "An der Tuchbleiche 6, Biebesheim"}]);
    });

  });

  it('should exists', inject(function($controller) {
    //spec body
    var detailsCtrl = $controller('DetailsCtrl', { $scope: {}, $routeParams: {}});
    expect(detailsCtrl).toBeDefined();
  }));

  describe('DetailsCtrl', function() {
    var $httpBackend, scope, routeParams, ctrl;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('zaehler/04AB019104.json').
        respond([{'datum': '2014-08-01T12:00:00', 'stand': 12345.6}]);
      routeParams = {'zaehlerNr': '04AB019104'};
      scope = $rootScope.$new();
      ctrl = $controller('DetailsCtrl', {$scope: scope, $routeParams: routeParams});
    }));

    it('should create "Zaehlerstand" model with 1 "Zaehlerstand" fetched from xhr', function() {
      expect(scope.zaehlerNr).toBe('04AB019104');
      expect(scope.staende).toEqualData([]);
      $httpBackend.flush();
      expect(scope.staende).toEqualData([{'datum': new Date('2014-08-01T12:00:00'), 'stand': 12345.6}]);
    });

  });

  it('should exists', inject(function($controller) {
    //spec body
    var detailsCtrl = $controller('EinstellungenCtrl', { $scope: {}, });
    expect(detailsCtrl).toBeDefined();
  }));

  describe('EinstellungenCtrl', function() {
    var $httpBackend, scope, routeParams, ctrl;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('EinstellungenCtrl', {$scope: scope});
    }));

    it('should create "Einstellungen" model with 1 "Basisdaten"', function() {
      expect(scope.einstellungen.arten.length).toBe(5);
      expect(scope.einstellungen.arten[1]).toEqualData({'art': 'Gas', 'einheit': 'm³'});
    });

  });

});
