'use strict';

angular.module('clientApp')
  .controller('DetailsCtrl', function ($scope, StateService) {

    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    })

    StateService.getVendorInfo();
    // StateService.getVendorToDisplay().then(function() {
    // 	$scope.vendorToDisplay = StateService.getVendorToDisplay();
    // })


  });

