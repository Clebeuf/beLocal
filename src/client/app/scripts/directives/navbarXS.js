'use strict';

angular.module('clientApp')
  .directive('navbarXS', function (StateService, AuthService, $location, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbarxs.html',
      controller: ['$scope', function($scope) {
        $scope.AuthService = AuthService;
        $scope.loginError = false;

        $scope.showLogin = function() {
            AuthService.showLogin().then(function(status) {
                if(status === 500) {
                  angular.element('#noValidAccountModal').modal('show');
                };
            });
        }

        $scope.reloadMainPage = function() {
            $location.path('/');

            $timeout(function() {
                angular.element('#trendingTab').trigger('click');
            })
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

        $scope.displayAccountPage = function() {
            if(StateService.getUserType() === "VEN") {
                $location.path('/vendor');
            }
        }
      }],
    };
  });
