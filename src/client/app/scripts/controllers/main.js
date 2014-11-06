'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, StateService, $q) {

    $scope.showCategory = false;
    $scope.showTag = false;
    $scope.selectedCategory = 'All Products';
    $scope.selectedTags = 'All Products';

    $scope.tagSelected = function(tagName) {
      if (typeof($scope.selectedTags) === 'string' && tagName.match('All Products')){
        return true;
      }
      
      for(var i = 0; i < $scope.selectedTags.length; i++) {
        if(tagName == $scope.selectedTags[i]) {
          return true;
        }
      }
      return false;
    }

    $scope.doTagFilter = function(tagName) {
      if (tagName.match('All Products')){
        $scope.getAllProducts('tag');
      } else {
        var index = $scope.selectedTags.indexOf(tagName); 
        
        if(index !== -1) {
            $scope.selectedTags.splice(index, 1);
        } else { 
          if (typeof($scope.selectedTags) === 'string'){
            $scope.selectedTags = [];
          }
          $scope.selectedTags.push(tagName);
        }
        
        // If no tag is selected, disable tags
        if ($scope.selectedTags.length < 1) {
          $scope.getAllProducts('tag');
        } else {
          $scope.showTag = true;
        }
      }
    }
    
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
    //$scope.resetProductLists();
    $scope.showCategory = true;
    $scope.selectedCategory = category.name;
  }
  
  $scope.getAllProducts = function(resetSelection) {  
   // $scope.resetProductLists();
    if (resetSelection.match('category')) {
      $scope.showCategory = false;
      $scope.selectedCategory = 'All Products';
    } else if (resetSelection.match('tag')) {
      $scope.showTag = false;
      $scope.selectedTags = 'All Products';
    }
  }

});


