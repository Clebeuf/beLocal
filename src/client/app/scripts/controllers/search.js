'use strict';

angular.module('clientApp')
    .controller('SearchCtrl', function ($scope, $stateParams, StateService, $timeout, $location, $window) {
        $scope.productResults = [];
        $scope.vendorResults = [];
        $scope.marketResults = [];
        $scope.query = $stateParams.q;

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

        $scope.doSearch();                      
  });
