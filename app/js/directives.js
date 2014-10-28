'use strict';

/* Directives */
var zaehlerjouralDirectives = angular.module('zaehlerjournal.directives', []);

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d*)?$/;
/*
 * Konvertiert Eingaben in Dezimalzahlen, egal ob Dezimaltrenner Punkt oder 
 * Komma ist.
 */
zaehlerjouralDirectives.directive('smartFloat', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attributes, controller) {
      //console.log('smartFloat.link');
      controller.$parsers.unshift(function(viewValue) {
        if (FLOAT_REGEXP.test(viewValue)) {
          controller.$setValidity('smartFloat', true);
          return parseFloat(viewValue.replace(',', '.'));
        } else {
          controller.$setValidity('smartFloat', false);
          return undefined;
        };
      });
    }
  };
});

zaehlerjouralDirectives.directive('minValue', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      //console.log('minValue.link');
      ctrl.$parsers.unshift(function(viewValue) {
        var minValue = parseFloat(attrs.minValue);
        //console.log(attrs.minValue + " ? " + viewValue);
        if (FLOAT_REGEXP.test(viewValue)) {
          ctrl.$setValidity('float', true);
          var zaehlerstand = parseFloat(viewValue.replace(',', '.'));
          if (zaehlerstand >= minValue) {
            ctrl.$setValidity('minValue', true);
          } else {
            ctrl.$setValidity('minValue', false);
          };
          return zaehlerstand;
        } else {
          ctrl.$setValidity('float', false);
          return;
        };
      });
    }
  };
});
