'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, StateService, $q, $rootScope, $window) {

    $scope.showCategory = false; // True when we are displaying category filtered results
    $scope.showTag = false; // True when we are displaying tag filtered results
    $scope.selectedCategory = 'All Products'; // Name of currently selected category ('All Products' is a special value)
    $scope.selectedTags = 'All Products'; // Name of currently selected tag ('All Products' is a special value)
    $scope.productFilterExpr = {}; // Expression to filter products by
    $scope.showXSNav = false; // Should we be showing the XS nav bar?
    $scope.fetchingData = false;

    // This line of code is used when a tag in a product details modal is clicked. We store the tag that was clicked in StateService
    // then read it here and display the correct filtering options accordingly.
    $scope.tagToDisplay = StateService.readTagToDisplay();

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    // Called when the value in the category dropdown changes (mobile view only)
    // This is what does the category filtering on mobile
    $scope.updateCategoryDropdown = function() {
      $scope.getAllProducts('tag');      
      if($scope.dropdownCategory.name === 'All Products') {
        $scope.getAllProducts('category');
        $scope.dropdownCategory = $scope.dropdownCategoryList[0];
      }
      else {
        $scope.getProductsWithCategory($scope.dropdownCategory);
      }
    }

    // Called on scroll/resize events to see if we should be displaying the XS nav bar or not    
    $scope.checkNav = function() {
      if(angular.element($window).scrollTop() > 140 || angular.element($window).width() < 768) {
        $scope.safeApply(function() {
          $scope.showXSNav = true;
        });
      } else {
        $scope.safeApply(function() {
          $scope.showXSNav = false;
        })
      }        
    }

    if(angular.element($window).width() < 768) {
      $scope.safeApply(function() {
        $scope.showXSNav = true;
      });
    }            

    angular.element($window).resize(function() {
        $scope.checkNav();
    });    

    angular.element($window).scroll(function(){
        $scope.checkNav();        
    });

    // Construct masonry for product cards instantly (no timeout). This is used for filtering
    $scope.instantTrendingMasonry = function() {
      $timeout(function() {
        $rootScope.$broadcast('masonry.reload');
      }, 250); 
    };    

    // Set filters for products and tags
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
    
    // Returns true if the tag with name tagName is selected, false otherwise
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

    // This is what does tag selection/deselection
    $scope.doTagFilter = function(tagName) {
      if (tagName.match('All Products')){
        $scope.getAllProducts('tag'); // Display all products
      } 
      else {
        var index = $scope.selectedTags.indexOf(tagName);         
        if(index !== -1) {
            // If we have a tag selected already, we should deselect it
            $scope.selectedTags.splice(index, 1); 
            if ($scope.selectedTags.length == 0) { 
              $scope.getAllProducts('tag');
            }
        } else { 
          // Otherwise the tag is deselected, so we should select it.
          if (angular.isString($scope.selectedTags)) {
            // If there are no currently selected tags, reinitialize $scope.selectedTags
            $scope.selectedTags = [];
          }
          // Push the tag to be selected into $scope.selectedTags.
          $scope.selectedTags.push(tagName);
          $scope.showTag = true;
        }
      }
      
      $scope.setProductFilter(); // Update filter for tags and categories
      $scope.instantTrendingMasonry(); // Reinitialize product card masonry
    }
    
    // If the current user is a vendor and they have clicked themselves, take them to their vendor page.
    // Otherwise, take them to the vendor details page for the vendor they have clicked
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
    
    // Get list of possible tags from server.
    StateService.getTags().then(function() {
      $scope.tagList = StateService.getTagList();
    });
    
    // Get list of categories from server and initialize category list (desktop) and dropdown category list (mobile)
    StateService.getCategories().then(function() {
      $scope.categoryList = StateService.getCategoryList();
      $scope.dropdownCategoryList = [];
      $scope.dropdownCategoryList.push({'name' : 'All Products'}); // Little bit of a hack to get the dropdown on mobile to work
      for(var i = 0; i < $scope.categoryList.length; i++) {
        $scope.dropdownCategoryList.push($scope.categoryList[i]);
      }
      $scope.dropdownCategory = $scope.dropdownCategoryList[0];      
    });
    
    // If we are on a product details modal and a vendor name is clicked, go to their vendor page.
    $scope.goToVendorDetails = function(vendorID){
      $scope.hideProductDetailsModal();

      
      angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
        // Timeout is necessary here to ensure that angular has time to catch up before redirect
        $timeout(function() {
         $location.path('vendor/details/'+ vendorID);
        });
      });
      angular.element('#productDetailsModal').modal('hide');

    }
   
// Commented out location code. When we decide to do location again, we'll need to uncomment this and fix it up.
 /*
    StateService.getUserPosition().then(function() {
        StateService.getTrendingProducts().then(function() {
          $scope.trendingProducts = StateService.getTrendingProductsList();
        });
        StateService.getVendors().then(function() {
          $scope.vendors = StateService.getVendorsList();
          $rootScope.$broadcast('generateMapPins');
          $rootScope.$broadcast('forceRefreshMap');
        });        
    });
*/
  
  // Get a list of all trending products from database 
  // Eventually, we should fix this to include pagination
  /*StateService.getTrendingProducts().then(function() {
    $scope.trendingProducts = StateService.getTrendingProductsList();
  });*/
  
  // Get next page of trending products from database
  $scope.trendingProductsNextPage = function() {
    
    if ($scope.fetchingData) { 
      return;   
    }

    // Get the first page
    if (!$scope.trendingProducts){
      $scope.fetchingData = true;
      
      StateService.getTrendingProducts().then(function() {
        $scope.trendingProducts = StateService.getTrendingProductsList();
        $scope.fetchingData = false;
      });
      
    } else {
     
      // check if all pages are already fetched
      if (!$scope.trendingProducts.next) { console.log("no more pages.");
        return;
      }
      
      // Get next page
      $scope.fetchingData = true;     
      StateService.getTrendingProductsPage($scope.trendingProducts.next).then(function() {
        var pageData = StateService.getTrendingProductsList();
        
        // update trendingProducts
        $scope.trendingProducts.next = pageData.next;
        $scope.trendingProducts.previous = pageData.previous;
        
        var last = $scope.trendingProducts.results.length;       
        for(var i = 0; i < pageData.results.length; i++) {
          $scope.trendingProducts.results.push(pageData.results[i]);
        }
        
        $scope.fetchingData = false;
        // TODO: load masonry : $element.masonry( 'appended', $newElems, true ); or reload();
      }); 
    }
  }

  // Get a list of all vendors from database
  StateService.getVendors().then(function() {
    $scope.vendors = StateService.getVendorsList();
    $rootScope.$broadcast('generateMapPins'); // Regenerate map pins
    $rootScope.$broadcast('forceRefreshMap'); // Refresh map
  })

  // Get a list of all markets from database
  StateService.getMarkets().then(function() {
    $scope.marketList = StateService.getMarketList();
    $rootScope.$broadcast('generateMapPins'); // Regenerate map pins
    $rootScope.$broadcast('forceRefreshMap'); // Refresh map
  });
  
  // Used to filter products by category on mobile view (from dropdown)
  $scope.getProductsWithCategory = function(category) {
    $scope.showCategory = true;
    $scope.selectedCategory = category.name;
    for(var i = 0; i < $scope.dropdownCategoryList.length; i++) {
      if($scope.dropdownCategoryList[i].id === category.id) {
        $scope.dropdownCategory = $scope.dropdownCategoryList[i];
        break;
      }
    }
    $scope.setProductFilter();
    $scope.instantTrendingMasonry();
  }
  
  // Reset all filters for either categories or tags depending on the value of resetSelection
  $scope.getAllProducts = function(resetSelection) {  
    if (resetSelection.match('category')) {
      $scope.showCategory = false;
      $scope.selectedCategory = 'All Products';
      $scope.dropdownCategory = $scope.dropdownCategoryList[0]; // reset dropdown on mobile 
    } 
    else if (resetSelection.match('tag')) {
      $scope.showTag = false;
      $scope.selectedTags = 'All Products';
    }
    // Refilter products and apply masonry
    $scope.setProductFilter();
    $scope.instantTrendingMasonry();
  }
  
  // Seemingly unimportant, this line of code ensures that if a tag has been passed in from another page (such as from a product details modal),
  // we will filter by that tag to display the relevant products. This is how product detail modal tags work when we have to redirect to main from
  // different views.
  if($scope.tagToDisplay != undefined) {
    $scope.doTagFilter($scope.tagToDisplay);
  }  

});


