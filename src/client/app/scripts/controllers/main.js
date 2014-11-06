'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, StateService, $q) {

    $scope.showCategory = false;
    $scope.showTag = false;
    $scope.selectedCategory = 'All Products';
    $scope.selectedTag = 'All Products';
    
    $scope.displayVendor = function (id) {
      $location.path('vendor/details/'+id).replace();
    };   
	    
    $scope.showProductDetailsModal = function(item) {
    	$scope.product = item;   	
    };

    $scope.hideProductDetailsModal = function() {   
    	$scope.product = {};    		
    };
    
    StateService.getTags().then(function() {
      $scope.tagList = StateService.getTagList();
    });
    
    StateService.getCategories().then(function() {
      $scope.categoryList = StateService.getCategoryList();
    });
    
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
  
  $scope.resetProductLists = function() {
    $scope.showCategory = false;
    $scope.showTag = false;
  }
  
  $scope.getProductsWithCategory = function(category) {
    $scope.resetProductLists();
    $scope.showCategory = true;
    $scope.selectedCategory = category.name;
  }
  
  $scope.getProductsWithTag = function(tag) {
    $scope.resetProductLists();
    $scope.showTag = true;
    $scope.selectedTag = tag.name;
  }
  
  $scope.getAllProducts = function() {  
    $scope.resetProductLists();
    $scope.selectedCategory = 'All Products';
    $scope.selectedTag = 'All Products';
  }

});


