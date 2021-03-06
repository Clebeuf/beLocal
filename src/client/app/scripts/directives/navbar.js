'use strict';

angular.module('clientApp')
  .directive('navBar', function (StateService, AuthService, $location, $timeout, $window, $http, $sce, $rootScope, $state) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: ['$scope', function($scope) {
        $scope.AuthService = AuthService; // Put AuthService on the scope so that it is accessible from HTML
        $scope.loginError = false; // True if there has been a login error 
        $scope.productSuggestions = []; // List of autocomplete product suggestions that comes back from the server
        $scope.StateService = StateService; // Put StateService on the scope so that it is accessible from HTML
        $scope.state = $state; // State is necessary to check for which page we're on in the HTML. Put it on the scope too.

        // Go to the manage page
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

        // This is a dirty hack necessary to ensure that back-button history is preserved correctly and that navigation events
        // fire properly when clicking on any of the tabs (In Season, Farmers, Markets) in the nav bar. Essentially, we must
        // navigate back to / if we're not there already, and then we must set either #trending, #vendors or #farmers in the location.hash
        // so that when main.js loads, it knows which tab we should be displaying.
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

        // Refresh the map present on any page
        $scope.refreshMap = function() {
            $rootScope.$broadcast('forceRefreshMap');    
        }        

        // Autocomplete for search
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

        // Called when a user selects an suggested entry for search from the dropdown
        $scope.onSelect = function($item,$model,$label){

            if($item.vendorSearch != null) {
                $window.location.href='#/search/vendors?q=' + encodeURI($item.vendorSearch);
            } else if($item.marketSearch != null) {
                $window.location.href='#/search/markets?q=' + encodeURI($item.marketSearch);
            }else {
                $window.location.href='#/search/products?q=' + encodeURI($item.name);
            }
        }         

        // Reloads the main page and navigates to the trending tab.
        $scope.reloadMainPage = function() {
            $scope.setHash('trending');
        }

        // Create a new vendor
        $scope.createVendor = function() {
            AuthService.createVendor();
        }

        // Create a new customer
        $scope.createCustomer = function() {
            AuthService.createCustomer();
        }       

        // Show customer sign up information on the welcome screen
        $scope.showCustomerSignUp = function() {
            $location.path('/welcome');
            $location.hash('foodies');
        }

        // Shwo vendor sign up information on the welcome screen
        $scope.showFarmerSignUp = function() {
            $location.path('/welcome');
            $location.hash('farmers');
        }  

        // Display vendor account page (Used for My Profile in the My Account dropdown)
        $scope.displayAccountPage = function() {
            if(StateService.getUserType() === "VEN") {
                $location.path('/vendor');
            }
        }

        // vendor tour was requested
        $scope.showVendorTour = function() {
            // if on seller page start tour
            if ($location.path() === '/vendor'){
                $scope.tour.restart(true);
            } else { // redirect to the seller page and pass request to start the tour.
                $location.path('/vendor');
                $location.hash('tour');
            }
        }  

        // Perform a product search
        $scope.doSearch = function(value){
          $window.location.href='#/search/products?q=' + encodeURI(value);
        }         
      }],
    };
  });
