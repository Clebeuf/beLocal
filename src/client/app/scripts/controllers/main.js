'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $timeout, StateService) {

    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    });

    $timeout(function() {
		var container = document.querySelector('#masonry-container');
		var msnry = new Masonry(container, {
		  itemSelector: '.ms-item',
		  columnWidth: '.ms-item'
		});    
    }, 1000)

  });
