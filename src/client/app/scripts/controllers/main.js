'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, StateService) {

    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    })

    StateService.getMarkets().then(function() {
    	$scope.marketlist = StateService.getMarketList();
    })

  });
