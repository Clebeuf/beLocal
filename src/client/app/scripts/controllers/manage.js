'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService, $location) {
    $scope.inactiveVendors = [];
    $scope.users = [];
    $scope.showXSNav = true;

    StateService.getManageVendors().then(function(response) {
        $scope.inactiveVendors = response.data;
    });

    StateService.getManageUsers().then(function(response) {
        $scope.users = response.data;
    }); 

    $scope.displayVendor = function (id) {         
        $location.path('vendor/details/'+ id);
    };       

    $scope.activateVendor = function(vendor) {
        StateService.activateVendor(vendor).then(function() {
            StateService.getManageVendors().then(function(response) {
                $scope.inactiveVendors = response.data;
            });             
        });
    }
    
  });
