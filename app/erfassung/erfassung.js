/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('zaehlerjournal.erfassung', ['ngRoute', 'zaehlerjournal.services'])
/* Routing*/
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/erfassung/:adresse', {templateUrl: 'erfassung/erfassung.html', controller: 'ErfassungCtrl'});
}])

/* Controllers */
.controller('ErfassungCtrl', ['$scope', '$routeParams', 'Zaehlerjournal', 'persistanceService',
  function($scope, $routeParams, Zaehlerjournal, persistanceService){
    //console.log('init ErfassungCtrl');
    $scope.adresse = $routeParams.adresse;
    $scope.immobilien = Zaehlerjournal.getImmobilien();
    $scope.immobilie = Zaehlerjournal.findImmobilieByAdresse($scope.adresse);
    $scope.saveZaehler = function() {
      //console.dir($scope.immobilie.zaehlers);
      Zaehlerjournal.addZaehlerstand($scope.immobilie.zaehlers);
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        $scope.immobilie.zaehlers[i].zaehlerstand = null;
      };
      $scope.form.$setPristine();
      persistanceService.saveData($scope.immobilien);
    };
    $scope.isAtLeastOneZaehlerInvalid = function() {
      if ($scope.immobilie === null || $scope.immobilie.zaehlers === null) {
        return true;
      };
      var invalid = true;
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i].zaehlerstand !== null) {
          invalid = false;
        };
      };
      if (invalid) {
        return true;
      };
      for (var i = 0; i < $scope.immobilie.zaehlers.length; i++) {
        if ($scope.immobilie.zaehlers[i].zaehlerstand !== null &&
            $scope.immobilie.zaehlers[i].zaehlerstand < $scope.immobilie.zaehlers[i].aktuellerZaehlerstand) {
          return true;
        };
      };
      return false;
    };
  }
])
;