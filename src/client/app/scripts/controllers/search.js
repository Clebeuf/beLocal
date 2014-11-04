'use strict';

angular.module('clientApp')
    .controller('SearchCtrl', function ($scope, $stateParams, StateService) {
        $scope.productResults = [];
        $scope.vendorResults = [];
        $scope.marketResults = [];

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
                console.log('Product searching!');
                $scope.doProductSearch($stateParams.q);
            } else if($stateParams.search_type === 'vendors') {
                console.log('Vendor searching!');
                $scope.doVendorSearch($stateParams.q);            
            } else if($stateParams.search_type === 'markets') {
                console.log('Market searching!');
                $scope.doMarketSearch($stateParams.q);            
            } else {
                console.log('Error!');
            }
        } 

        $scope.doSearch();                      
  });
