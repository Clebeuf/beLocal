'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService, $location) {
    $scope.inactiveVendors = [];
    $scope.users = [];
    $scope.showXSNav = true;

    $scope.initialize = function() {
        StateService.getManageVendors().then(function(response) {
            $scope.inactiveVendors = response.data;
        });

        StateService.getManageUsers().then(function(response) {
            $scope.users = response.data;
        }); 
    }

    $scope.displayVendor = function (id) {         
        $location.path('vendor/details/'+ id);
    };

    $scope.deleteUser = function(user) {
        var response = prompt('Say the magic word to make ' + user.first_name + ' ' + user.last_name + ' go boom!');
        if(response === '$gituvicsoup') {
            StateService.deleteUser(user.id).then(function() {
                $scope.initialize();
            });
        }
    }    

    $scope.activateVendor = function(vendor) {
        StateService.activateVendor(vendor).then(function() {
            StateService.getManageVendors().then(function(response) {
                $scope.inactiveVendors = response.data;
            });             
        });
    }

    $scope.initialize();
    
  });
