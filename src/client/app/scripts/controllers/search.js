'use strict';

angular.module('clientApp')
    .controller('SearchCtrl', function ($scope, $stateParams, StateService, $timeout, $location) {
        $scope.productResults = [];
        $scope.vendorResults = [];
        $scope.marketResults = [];
        $scope.query = $stateParams.q;

        $scope.doProductSearch = function(query) {
            StateService.doProductSearch(query).then(function(response) {
                $scope.productResults = response.data;
            });
        }

        $scope.doVendorSearch = function(query) {
            StateService.doVendorSearch(query).then(function(response) {
                $scope.vendorResults = response.data;
            });
        } 

        $scope.doSearch = function() {
            if($stateParams.search_type === 'products') {
                $scope.doProductSearch($stateParams.q);
            } else if($stateParams.search_type === 'vendors') {
                $scope.doVendorSearch($stateParams.q);            
            } else if($stateParams.search_type === 'markets') {
                $scope.doMarketSearch($stateParams.q);            
            }
        } 

        $scope.showProductDetailsModal = function(item) {
            $scope.product = item;      
        };

        $scope.hideProductDetailsModal = function() {   
            $scope.product = {};            
        }; 
        
        $scope.goToVendorDetails = function(vendorID){
            $scope.hideProductDetailsModal();


          angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
            $timeout(function() {
             $location.path('vendor/details/'+ vendorID).replace();
            });
          });
          angular.element('#productDetailsModal').modal('hide');

        }               

        $scope.doSearch();                      
  });
