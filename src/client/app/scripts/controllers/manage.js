'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService) {
    $scope.inactiveVendors = [];

    StateService.getManageVendors().then(function(response) {
        $scope.inactiveVendors = response.data;
    });

    $scope.activateVendor = function(vendor) {
        StateService.activateVendor(vendor).then(function() {
            StateService.getManageVendors().then(function(response) {
                $scope.inactiveVendors = response.data;
            });             
        });
    }
    
  });
