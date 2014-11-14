'use strict';

angular.module('clientApp')
  .directive('navBar', function (StateService, AuthService, $location, $timeout, $window, $http, $sce, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: ['$scope', function($scope) {
        $scope.AuthService = AuthService;
        $scope.loginError = false;
        $scope.productSuggestions = [];
        $scope.StateService = StateService;

        $scope.goToManage = function() {
            $location.path('/manage');
        }

        angular.element('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { 
            $rootScope.$broadcast('forceRefreshMap');
            angular.element(e.target).triggerHandler('click');
        });

        $scope.showLogin = function() {
            AuthService.showLogin().then(function(status) {
                if(status === 500) {
                  angular.element('#noValidAccountModal').modal('show');
                };
            });
        }

        $scope.refreshMap = function() {
            $rootScope.$broadcast('forceRefreshMap');    
        }        

        $scope.updateProductSuggestions = function(val) {
            return $http.get(StateService.getServerAddress() + "search/autocomplete?q=" + val
                ).then(function(response){
                    var products = response.data.products;
                    products.push({
                        name: $sce.trustAsHtml('Search for <b>' + val + '</b> in vendors'),
                        vendorSearch: val
                    });
                    return products;
            });
        }
        $scope.onSelect = function($item,$model,$label){

            if($item.vendorSearch != null) {
                $window.location.href='#/search/vendors?q=' + $item.vendorSearch;
            } else {
                $window.location.href='#/search/products?q=' + $item.name;
            }
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

        $scope.doSearch = function(value){
          $window.location.href='#/search/products?q=' + value;
        }         
      }],
    };
  });
