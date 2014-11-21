'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService) {
    $scope.inactiveVendors = [];
    $scope.users = [];

    StateService.getManageVendors().then(function(response) {
        $scope.inactiveVendors = response.data;
    });

    StateService.getManageUsers().then(function(response) {
        $scope.users = response.data;
    });    

    $scope.activateVendor = function(vendor) {
        StateService.activateVendor(vendor).then(function() {
            StateService.getManageVendors().then(function(response) {
                $scope.inactiveVendors = response.data;
            });             
        });
    }
    
  });
