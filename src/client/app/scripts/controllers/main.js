'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, StateService) {

    $scope.showProductDetailsModal = function() {
    }
	    
    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    })

  });
