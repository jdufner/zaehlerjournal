'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
  beforeEach(module('zaehlerjournal.filters'));
  describe('encodeUri', function() {
    var encodeUri;
    beforeEach(inject(function(encodeUriFilter){
      encodeUri = encodeUriFilter;
    }));
    it('should URI encode a string', function() {
      expect(encodeUri("abc")).toBe("abc");
      expect(encodeUri(" ")).toBe("%20");
    });
  });
  describe('encodeUriComponent', function() {
    var encodeUriComponent;
    beforeEach(inject(function(encodeUriComponentFilter){
      encodeUriComponent = encodeUriComponentFilter;
    }));
    it('should URI encode a string', function() {
      expect(encodeUriComponent("abc")).toBe("abc");
      expect(encodeUriComponent(" ")).toBe("%20");
    });
  });
});
