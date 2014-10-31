'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, StateService, $q) {
	    
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
   
    StateService.getUserPosition().then(function() {
        StateService.getTrendingProducts().then(function() {
          $scope.trendingProducts = StateService.getTrendingProductsList();
        });
        StateService.getVendors().then(function() {
          $scope.vendors = StateService.getVendorsList();
        });        
    });
    
    $scope.likeUnLikeProduct = function(product) {
      StateService.likeUnlikeProduct(product).then(function() {
        product = StateService.getLikedUnlikedProduct();
      });
    };

    $scope.trendingMasonry = function() {
	    $timeout(function() {
			var container = document.querySelector('#masonry-container');
			var msnry = new Masonry(container, {
			  itemSelector: '.ms-item',
			  columnWidth: '.ms-item'
			});    
	    }, 1000)
	};

    $scope.marketMasonry = function() {
		var container = document.querySelector('#masonry-market-container');
		var msnry = new Masonry(container, {
		  itemSelector: '.ms-market-item',
		  columnWidth: '.ms-market-item'
		});    
	};

	/* Magic! This is a hacky way of ensuring that masonry rebuilds itself while the proper tab content pane is visible
	   (it won't work otherwise) */
	angular.element('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { 
		angular.element(e.target).triggerHandler('click');
	})

  StateService.getMarkets().then(function() {
  	$scope.marketList = StateService.getMarketList();
  });

  $scope.trendingMasonry();
  $scope.marketMasonry();

});


