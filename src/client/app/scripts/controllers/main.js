'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, StateService, $q) {

    $scope.showCategory = false;
    $scope.showTag = false;
    $scope.selectedCategory = 'All Products';
    $scope.selectedTags = 'All Products';
    $scope.productFilterExpr = {};

    $scope.tagToDisplay = StateService.readTagToDisplay();

    $scope.instantTrendingMasonry = function() {
      $timeout(function() {
      var container = document.querySelector('#masonry-container');
      var msnry = new Masonry(container, {
        itemSelector: '.ms-item',
        columnWidth: '.ms-item'
      });    
      })
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

    $scope.setProductFilter = function() {
      if (!$scope.showCategory && !$scope.showTag) {
        $scope.productFilterExpr = {};
      }
      else if ($scope.showCategory && !$scope.showTag) {
        $scope.productFilterExpr = {category : $scope.selectedCategory};
      }
      else if (!$scope.showCategory && $scope.showTag) {
        $scope.productFilterExpr = {tags : $scope.selectedTags};
      }
      else {
        $scope.productFilterExpr = {category : $scope.selectedCategory, tags : $scope.selectedTags};
      }
    }
    
    $scope.tagSelected = function(tagName) {
      if (angular.isString($scope.selectedTags) && tagName.match('All Products')){
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
      } 
      else {
        var index = $scope.selectedTags.indexOf(tagName);         
        if(index !== -1) {
            $scope.selectedTags.splice(index, 1); 
            if ($scope.selectedTags.length == 0) { 
              $scope.getAllProducts('tag');
            }
        } 
        else { 
          if (angular.isString($scope.selectedTags)) { 
            $scope.selectedTags = [];
          }
          $scope.selectedTags.push(tagName);
          $scope.showTag = true;
        }
      }
      
      $scope.setProductFilter();
      $scope.instantTrendingMasonry();
    }
    
    $scope.displayVendor = function (id) {
      var user = StateService.getCurrentUser();
      if(user && user.userType === 'VEN' && user.vendor.id === id) {
        $location.path('/vendor');
      } else {            
        $location.path('vendor/details/'+ id);
      }
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
    
  $scope.getProductsWithCategory = function(category) {
    $scope.showCategory = true;
    $scope.selectedCategory = category.name;
    $scope.setProductFilter();
    $scope.instantTrendingMasonry();
  }
  
  $scope.getAllProducts = function(resetSelection) {  
    if (resetSelection.match('category')) {
      $scope.showCategory = false;
      $scope.selectedCategory = 'All Products';      
    } 
    else if (resetSelection.match('tag')) {
      $scope.showTag = false;
      $scope.selectedTags = 'All Products';
    }
    $scope.setProductFilter();
    $scope.instantTrendingMasonry();
  }

  if($scope.tagToDisplay != undefined) {
    $scope.doTagFilter($scope.tagToDisplay);
  }  

});


