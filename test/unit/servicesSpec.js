'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  
  describe('Zaehlerjournal', function() {
    var httpBackend, Zaehlerjournal;
    beforeEach(function() {
      module('zaehlerjournal.services');
      inject(function($httpBackend, _Zaehlerjournal_){
        httpBackend = $httpBackend;
        Zaehlerjournal = _Zaehlerjournal_;
      });
    });
    it('should have a getImmobilien function', function() {
      expect(angular.isFunction(Zaehlerjournal.getImmobilien)).toBe(true);
    });
    it('should have a getMetadaten function', function() {
      expect(angular.isFunction(Zaehlerjournal.getMetadaten)).toBe(true);
    });
    it('should have a setMetadaten function', function() {
      expect(angular.isFunction(Zaehlerjournal.setMetadaten)).toBe(true);
    });
  });
 
});
