'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService, $location) {
    $scope.inactiveVendors = []; // list of inactive vendors
    $scope.users = []; // list of all users for beLocal
    $scope.showXSNav = true;

    // Used to display weekday strings in various spots on this page.
    $scope.weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];    

    // Get a list of vendors and users from the server
    $scope.initialize = function() {
        StateService.getManageVendors().then(function(response) {
            $scope.inactiveVendors = response.data;
        });

        StateService.getManageUsers().then(function(response) {
            $scope.users = response.data;
        }); 

        StateService.getMarkets().then(function() {
            $scope.marketList = StateService.getMarketList();
        });
    }

    // Go to vendor details page for vendor with specified id
    $scope.displayVendor = function (id) {         
        $location.path('vendor/details/'+ id);
    };

    // Delete a user. The password is $gituvicsoup. Don't ask. 
    $scope.deleteUser = function(user) {
        var response = prompt('Say the magic word to make ' + user.first_name + ' ' + user.last_name + ' go boom!');
        if(response === '$gituvicsoup') {
            StateService.deleteUser(user.id).then(function() {
                $scope.initialize();
            });
        }
    } 

    // Comparison function used to sort weekdays in order from Monday - Sunday
    function compareWeekday(a,b) {
      return a.weekday - b.weekday;
    }     

    // Activate or deactivate a vendor
    $scope.activateVendor = function(vendor) {
        StateService.activateVendor(vendor).then(function() {
            StateService.getManageVendors().then(function(response) {
                $scope.inactiveVendors = response.data;
            });             
        });
    }

    // Initialize the manage view on first load
    $scope.initialize();
    
  });
