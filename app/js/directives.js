'use strict';

/* Directives */


var zaehlerjouralDirectives = angular.module('zaehlerjournal.directives', []);

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d*)?$/;
zaehlerjouralDirectives.directive('smartFloat', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (FLOAT_REGEXP.test(viewValue)) {
          ctrl.$setValidity('float', true);
          return parseFloat(viewValue.replace(',', '.'));
        } else {
          ctrl.$setValidity('float', false);
          return;
        };
      });
    }
  };
});

zaehlerjouralDirectives.directive('minValue', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
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
