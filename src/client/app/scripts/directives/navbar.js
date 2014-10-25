'use strict';

angular.module('clientApp')
  .directive('navBar', function (StateService, AuthService, $location) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: ['$scope', function($scope) {
        $scope.AuthService = AuthService;
        $scope.loginError = false;

        $scope.showLogin = function() {
            AuthService.showLogin();
        }

        $scope.createVendor = function() {
            AuthService.createVendor();
        }

        $scope.createCustomer = function() {
            AuthService.createCustomer();
        }       

        $scope.showCustomerSignUp = function() {
            $location.path('/welcome');
            $location.hash('customers');
        }

        $scope.showFarmerSignUp = function() {
            $location.path('/welcome');
            $location.hash('vendors');
        }        

      }],
    };
  });
