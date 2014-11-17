'use strict';

angular.module('clientApp')
    .controller('SearchCtrl', function ($scope, $stateParams, StateService, $timeout, $location, $window) {
        $scope.productResults = [];
        $scope.vendorResults = [];
        $scope.marketResults = [];
        $scope.query = $stateParams.q;
        $scope.showCategory = false;
        $scope.showTag = false;
        $scope.selectedCategory = 'All Products';
        $scope.selectedTags = 'All Products';
        $scope.productFilterExpr = {};

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

        $scope.doProductSearch = function(query) {
            StateService.doProductSearch(query).then(function(response) {
                $scope.productResults = response.data;
            });
        }

        $scope.displayVendor = function (id) {
          var user = StateService.getCurrentUser();
          if(user && user.userType === 'VEN' && user.vendor.id === id) {
            $location.path('/vendor');
          } else {            
            $location.path('vendor/details/'+ id);
          }
        };         

        $scope.doVendorSearch = function(query) {
            StateService.doVendorSearch(query).then(function(response) {
                $scope.vendorResults = response.data;
            });
        } 

        $scope.doMarketSearch = function(query) {
            StateService.doMarketSearch(query).then(function(response) {
                $scope.marketResults = response.data;
            });
        }         

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
    
        StateService.getTags().then(function() {
          $scope.tagList = StateService.getTagList();
        });
        
        StateService.getCategories().then(function() {
          $scope.categoryList = StateService.getCategoryList();
        });

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
          //$scope.instantTrendingMasonry();
        }

        $scope.getProductsWithCategory = function(category) {
            $scope.showCategory = true;
            $scope.selectedCategory = category.name;
            $scope.setProductFilter();
            //$scope.instantTrendingMasonry();
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
            //$scope.instantTrendingMasonry();
            }

            if($scope.tagToDisplay != undefined) {
            $scope.doTagFilter($scope.tagToDisplay);
        }  

        $scope.doSearch();                      
  });
