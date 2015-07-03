'use strict';

angular.module('clientApp')
  .controller('DetailsCtrl', function ($scope, $timeout, $stateParams, StateService, $rootScope, $window, $location, DateService) {

    $scope.DateService = DateService;

    StateService.setVendorToDisplay($stateParams.vendorid);
    $scope.minDate = new Date();    

    $scope.getDate = function(date) {
        if(date.getDay() == 0)
            return 7;
        else
            return date.getDay();
    }; 

    // Compare two dates to see if they are equal. (This is necessary in order to ignore times)
    // Also use getFullYear() and not getYear(). 
    $scope.compareDates = function(date1, date2) {
        if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
            return true;
        else
            return false;
    }

    $scope.addDays = function(d, n) {
        d.setDate(d.getDate() + n);
        return d;
    }

    $scope.getMonday = function(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }

    $scope.initDate = function(d) {
        var date = new Date(d)
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
        return date;        
    } 

    // Required for AngularJS to finish its digest loop
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

    // Navigate to market details page for a given market
    $scope.displayMarket = function (id) {
      $location.path('market/details/'+id);
    };

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

    // Disable/enable likes on the details page if the current user is authenticated
    if (StateService.getCurrentUser() === undefined) {
      $scope.likeDisabled = true;
    } else {
      $scope.likeDisabled = false;
    } 
    
    // Required to initialize tooltips on page load
    $timeout(function(){
      angular.element("[data-toggle='tooltip']").tooltip();
    });
    
    // Get vendor information from StateService
    StateService.getVendorInfo().then(function() {
      $scope.vendorDetails = StateService.getVendorDetails(); // Set it on scope
        $rootScope.$broadcast('generateMapPins'); // Re-generate all map pins
        $rootScope.$broadcast('forceRefreshMap'); // Refresh the map once pins have been generated
    });

    // Required for displaying weekday strings on selling location cards
    $scope.weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    // Called on selling/market location mouseover to make pins bounce
    $scope.highlightPins = function(object) {
        if(object && object.marker)
            object.marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    // Stop the bouncing!
    $scope.unHighlightPins = function(object) {
        if(object && object.marker)        
            object.marker.setAnimation(null);
    };    

    // Initialize product details modal
    $scope.showProductDetailsModal = function(item) {
        $scope.product = item;   
    };

    // Reset product details modal
    $scope.hideProductDetailsModal = function() {   
        $scope.product = {};            
    };    

    // Like or unlike an item
    $scope.likeUnlikeItem = function(item, itemName) {
      StateService.likeUnlikeItem(item, itemName).then(function() {
        item = StateService.getLikedUnlikedItem();
      });
    };
  });

