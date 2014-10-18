'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  var scope, elem, compiled, html;
  describe('smartFloat', function() {
    beforeEach(function() {
      module('zaehlerjournal.directives');
      html = '<form name="form"><input name="zaehlerstand" ng-model="zaehlerstand" type="text" smart-float="100"/></form>';
      inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        scope.zaehlerstand = null;
        elem = angular.element(html);
        compiled = $compile(elem)(scope);
        scope.$digest();
      });
    });
    it('parses decimal numbers with comma', function(){
      scope.form.zaehlerstand.$setViewValue('1,23');
      expect(scope.zaehlerstand).toBe(1.23);
      expect(scope.form.zaehlerstand.$valid).toBe(true);
      expect(scope.form.zaehlerstand.$error.smartFloat).toBe(false);
    });
    it('parses decimal numbers with dot', function(){
      scope.form.zaehlerstand.$setViewValue('1.23');
      expect(scope.zaehlerstand).toBe(1.23);
      expect(scope.form.zaehlerstand.$valid).toBe(true);
      expect(scope.form.zaehlerstand.$error.smartFloat).toBe(false);
    });
    it('parses decimal numbers with either dot or comma', function(){
      scope.form.zaehlerstand.$setViewValue('a');
      expect(scope.zaehlerstand).toBeUndefined();
      expect(scope.form.zaehlerstand.$valid).toBe(false);
      expect(scope.form.zaehlerstand.$error.smartFloat).toBe(true);
    });
  });
  describe('minValue="1"', function() {
    beforeEach(function() {
      module('zaehlerjournal.directives');
      html = '<form name="form"><input name="zaehlerstand" ng-model="zaehlerstand" type="text" min-value="1"/></form>';
      inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        scope.zaehlerstand = null;
        elem = angular.element(html);
        compiled = $compile(elem)(scope);
        scope.$digest();
      });
    });
    it('parses decimal numbers with comma and compares to minValue', function(){
      scope.form.zaehlerstand.$setViewValue('1,23');
      expect(scope.zaehlerstand).toBe(1.23);
      expect(scope.form.zaehlerstand.$valid).toBe(true);
      expect(scope.form.zaehlerstand.$error.float).toBe(false);
      expect(scope.form.zaehlerstand.$error.minValue).toBe(false);
    });
    it('parses decimal numbers with dot and compares to minValue', function(){
      scope.form.zaehlerstand.$setViewValue('1.23');
      expect(scope.zaehlerstand).toBe(1.23);
      expect(scope.form.zaehlerstand.$valid).toBe(true);
      expect(scope.form.zaehlerstand.$error.float).toBe(false);
      expect(scope.form.zaehlerstand.$error.minValue).toBe(false);
    });
    it('parses character', function(){
      scope.form.zaehlerstand.$setViewValue('a');
      expect(scope.zaehlerstand).toBeUndefined();
      expect(scope.form.zaehlerstand.$valid).toBe(false);
      expect(scope.form.zaehlerstand.$error.float).toBe(true);
      expect(scope.form.zaehlerstand.$error.minValue).toBeUndefined();
    });
  });
  describe('minValue="2"', function() {
    beforeEach(function() {
      module('zaehlerjournal.directives');
      html = '<form name="form"><input name="zaehlerstand" ng-model="zaehlerstand" type="text" min-value="2"/></form>';
      inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        scope.zaehlerstand = null;
        elem = angular.element(html);
        compiled = $compile(elem)(scope);
        scope.$digest();
      });
    });
    it('parses decimal numbers with comma and compares to minValue', function(){
      scope.form.zaehlerstand.$setViewValue('1,23');
      expect(scope.zaehlerstand).toBe(1.23);
      expect(scope.form.zaehlerstand.$valid).toBe(false);
      expect(scope.form.zaehlerstand.$error.float).toBe(false);
      expect(scope.form.zaehlerstand.$error.minValue).toBe(true);
    });
    it('parses decimal numbers with dot and compares to minValue', function(){
      scope.form.zaehlerstand.$setViewValue('1.23');
      expect(scope.zaehlerstand).toBe(1.23);
      expect(scope.form.zaehlerstand.$valid).toBe(false);
      expect(scope.form.zaehlerstand.$error.float).toBe(false);
      expect(scope.form.zaehlerstand.$error.minValue).toBe(true);
    });
    it('parses character', function(){
      scope.form.zaehlerstand.$setViewValue('a');
      expect(scope.zaehlerstand).toBeUndefined();
      expect(scope.form.zaehlerstand.$valid).toBe(false);
      expect(scope.form.zaehlerstand.$error.float).toBe(true);
      expect(scope.form.zaehlerstand.$error.minValue).toBeUndefined();
    });
  });
});
