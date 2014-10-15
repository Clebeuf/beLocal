'use strict';

angular.module('clientApp')
  .controller('DetailsCtrl', function ($scope, $timeout, StateService) {

    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    });

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    });

    StateService.getVendorInfo().then(function() {
    	$scope.vendorDetails = StateService.getVendorDetails();
    });

    $timeout(function() {
		var container = document.querySelector('#masonry-container');
		var msnry = new Masonry(container, {
		  itemSelector: '.ms-item',
		  columnWidth: '.ms-item'
		});    
    }, 1000)

  });

