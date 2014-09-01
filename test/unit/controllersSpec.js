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
    var uebersichtCtrl = $controller('UebersichtCtrl', { $scope: {} });
    expect(uebersichtCtrl).toBeDefined();
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

});
