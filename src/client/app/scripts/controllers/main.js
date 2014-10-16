'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, StateService) {

    $scope.showProductDetailsModal = function(item) {
    	$scope.product = item;   	
    }
	    
    $scope.hideProductDetailsModal = function() {
    	$scope.product = {};    		
    }
    
    $scope.gotToVendorDetails = function(vendor){
    	$scope.hideProductDetailsModal();
    	$location.path('/vendor/details/' + vendor.id); 
    }
    
    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    })

  });


