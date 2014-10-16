'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, StateService) {

    $scope.showProductDetailsModal = function(item) {
    	$scope.product = item;   	
    }
	    
    $scope.hideProductDetailsModal = function() {
    	$scope.product = {};    		
    }
    
    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    })

  });


