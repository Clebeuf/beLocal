'use strict';

angular.module('clientApp')
  .controller('MarketDetailsCtrl', function ($scope, StateService, $stateParams, $location, $window, $timeout) {

    // Get market information from the server based on the id passed along in the url. $stateParams handles all url variables.
    StateService.getMarketToDisplay($stateParams.marketid).then(function() {
    	$scope.marketDetails = StateService.getMarketDetails();
    });

    // Enable/disable liking
    if (StateService.getCurrentUser() === undefined) {
      $scope.likeDisabled = true;
    } else {
      $scope.likeDisabled = false;
    }   

    // Initialize tooltips
    $timeout(function(){
      angular.element("[data-toggle='tooltip']").tooltip();
    });     

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

    // Used to display weekday strings in selling location/market cards
    $scope.weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];    

    // Like or unlike an item
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

  });
