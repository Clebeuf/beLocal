'use strict';

angular.module('clientApp')
  .directive('navbarXS', function (StateService, AuthService, $location, $timeout, $window, $http, $sce, $state) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbarxs.html',
      controller: ['$scope', function($scope) {
        $scope.AuthService = AuthService;
        $scope.StateService = StateService;
        $scope.loginError = false;
        $scope.productSuggestions = [];
        $scope.state = $state;   

        // For documentation, please see navbar.js. These two controllers are identical.  

        $scope.goToManage = function() {
            $location.path('/manage');
        }           

        $scope.safeApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };          

        $scope.setHash = function(hash) {
            var oldPath = $location.path();           
            $scope.safeApply(function(){
                $location.path('/');
            }); 
            $timeout(function() {
                if(oldPath != '/') {
                    $location.replace();
                }
                $location.hash(hash);
            });             
        }

        $scope.updateProductSuggestions = function(val) {
            return $http.get(StateService.getServerAddress() + "search/autocomplete?q=" + val
                ).then(function(response){
                    var products = response.data.products;
                    products.push({
                        name: $sce.trustAsHtml('Search for <b>' + val + '</b> in vendors'),
                        vendorSearch: val
                    });
                    products.push({
                        name: $sce.trustAsHtml('Search for <b>' + val + '</b> in markets'),
                        marketSearch: val
                    });                    
                    return products;
            });
        }

        $scope.onSelect = function($item,$model,$label){

            if($item.vendorSearch != null) {
                $window.location.href='#/search/vendors?q=' + $item.vendorSearch;
            } else if($item.marketSearch != null) {
                $window.location.href='#/search/markets?q=' + $item.marketSearch;
            }else {
                $window.location.href='#/search/products?q=' + $item.name;
            }
        }         
   
        $scope.reloadMainPage = function() {
            $scope.setHash('trending');
        }

        $scope.createVendor = function() {
            AuthService.createVendor();
        }

        $scope.createCustomer = function() {
            AuthService.createCustomer();
        }       

        $scope.showCustomerSignUp = function() {
            $location.path('/welcome');
            $location.hash('foodies');
        }

        $scope.showFarmerSignUp = function() {
            $location.path('/welcome');
            $location.hash('farmers');
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
