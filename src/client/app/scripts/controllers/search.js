'use strict';

angular.module('clientApp')
    .controller('SearchCtrl', function ($scope, $stateParams, StateService, $timeout, $location, $window) {
        $scope.productResults = []; // List of product search results
        $scope.vendorResults = []; // List of vendor search results
        $scope.marketResults = []; // List of market search results
        $scope.query = $stateParams.q; // Query passed into this controller via the URL 
        $scope.showCategory = false; // True if we're currently filtering by a category
        $scope.showTag = false; // True if we're currently filtering by a tag
        $scope.selectedCategory = 'All Products'; // Name of currently selected category ('All Products' is a special value)
        $scope.selectedTags = 'All Products'; // Name of currently selected tag ('All Products' is a special value) 
        $scope.productFilterExpr = {}; // Expression to filter products by

        $scope.tagToDisplay = StateService.readTagToDisplay(); // I don't think this is necessary here... but I'm going to leave it in for now.

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

        // See documentation in main.js
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

        // See documentation in main.js
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

        // See documentation in main.js
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

        // See documentation in main.js
        $scope.instantTrendingMasonry = function() {
          $timeout(function() {
          var container = document.querySelector('#masonry-container');
          var msnry = new Masonry(container, {
            itemSelector: '.ms-item',
            columnWidth: '.ms-item'
          });    
          })
        };

        // See documentation in main.js
        $scope.trendingMasonry = function() {
          $timeout(function() {
          var container = document.querySelector('#masonry-container');
          var msnry = new Masonry(container, {
            itemSelector: '.ms-item',
            columnWidth: '.ms-item'
          });    
          }, 500)
        };

        // See documentation in main.js
        $scope.marketMasonry = function() {
          $timeout(function() {        
            var container = document.querySelector('#masonry-market-container');
            var msnry = new Masonry(container, {
              itemSelector: '.ms-market-item',
              columnWidth: '.ms-market-item'
            });    
          }, 500);
        };                

        // Search for products based on a query
        $scope.doProductSearch = function(query) {
            StateService.doProductSearch(query).then(function(response) {
                $scope.productResults = response.data;
                $scope.trendingMasonry();
            });
        }

        // Search for vendors based on a query
        $scope.displayVendor = function (id) {
          var user = StateService.getCurrentUser();
          if(user && user.userType === 'VEN' && user.vendor.id === id) {
            $location.path('/vendor');
          } else {            
            $location.path('vendor/details/'+ id);
          }
        };         

        // Return vendor search results and display them
        $scope.doVendorSearch = function(query) {
            StateService.doVendorSearch(query).then(function(response) {
                $scope.vendorResults = response.data;
            });
        } 

        // Return market search results and display them
        $scope.doMarketSearch = function(query) {
            StateService.doMarketSearch(query).then(function(response) {
                $scope.marketResults = response.data;
                $scope.marketMasonry();                
            });
        }         

        // Perform search based on the type of search (specified in the URL)
        $scope.doSearch = function() {
            if($stateParams.search_type === 'products') {
                $scope.doProductSearch($stateParams.q);
            } else if($stateParams.search_type === 'vendors') {
                $scope.doVendorSearch($stateParams.q);            
            } else if($stateParams.search_type === 'markets') {
                $scope.doMarketSearch($stateParams.q);            
            }
        } 

        $scope.showProductDetailsModal = function(item) {
            $scope.product = item;      
        };

        $scope.hideProductDetailsModal = function() {   
            $scope.product = {};            
        };           
    
        // See documentation in main.j
        StateService.getTags().then(function() {
          $scope.tagList = StateService.getTagList();
        });
        
        // See documentation in main.js
        StateService.getCategories().then(function() {
          $scope.categoryList = StateService.getCategoryList();
          $scope.dropdownCategoryList = [];
          $scope.dropdownCategoryList.push({'name' : 'All Products'});
          for(var i = 0; i < $scope.categoryList.length; i++) {
            $scope.dropdownCategoryList.push($scope.categoryList[i]);
          }
          $scope.dropdownCategory = $scope.dropdownCategoryList[0];      
        });

        // See documentation in main.js
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
        
        // See documentation in main.js
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

        // See documentation in main.js
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
          //$scope.instantTrendingMasonry();
        }

        // See documentation in main.js
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
            //$scope.instantTrendingMasonry();
        }

        // See documentation in main.js
        $scope.getAllProducts = function(resetSelection) {  
            if (resetSelection.match('category')) {
              $scope.showCategory = false;
              $scope.selectedCategory = 'All Products';      
              $scope.dropdownCategory = $scope.dropdownCategoryList[0];              
            } 
            else if (resetSelection.match('tag')) {
              $scope.showTag = false;
              $scope.selectedTags = 'All Products';
            }
            $scope.setProductFilter();
            //$scope.instantTrendingMasonry();
            }

            if($scope.tagToDisplay != undefined) {
            $scope.doTagFilter($scope.tagToDisplay);
        }  

        $scope.doSearch();                      
  });
