'use strict';

angular.module('clientApp')
  .controller('MarketDetailsCtrl', function ($scope, StateService, $stateParams, $location, $window) {

    StateService.getMarketToDisplay($stateParams.marketid).then(function() {
    	$scope.marketDetails = StateService.getMarketDetails();
    });

    if (StateService.getCurrentUser() === undefined) {
      $scope.likeDisabled = true;
    } else {
      $scope.likeDisabled = false;
    }    

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

    $scope.weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];    

    $scope.likeUnlikeItem = function(item, itemName) {
      StateService.likeUnlikeItem(item, itemName).then(function() {
        item = StateService.getLikedUnlikedItem();
      });
    };

    $scope.showProductDetailsModal = function(item) {
        $scope.product = item;      
    };

    $scope.hideProductDetailsModal = function() {   
        $scope.product = {};            
    };  

    $scope.displayVendor = function (id) {
      var user = StateService.getCurrentUser();
      if(user && user.userType === 'VEN' && user.vendor.id === id) {
        $location.path('/vendor');
      } else {            
        $location.path('vendor/details/'+ id);
      }
    };        

  });
