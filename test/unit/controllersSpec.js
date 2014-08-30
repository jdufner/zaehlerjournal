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

  it('should ....', inject(function($controller) {
    //spec body
    var myCtrl2 = $controller('MyCtrl2', { $scope: {} });
    expect(myCtrl2).toBeDefined();
  }));
});
