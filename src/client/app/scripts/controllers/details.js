'use strict';

angular.module('clientApp')
  .controller('DetailsCtrl', function ($scope, $timeout, $stateParams, StateService, $rootScope, $window, $location) {

    StateService.setVendorToDisplay($stateParams.vendorid);

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

    if (StateService.getCurrentUser() === undefined) {
      $scope.likeDisabled = true;
    } else {
      $scope.likeDisabled = false;
    } 
    
    $timeout(function(){
      angular.element("[data-toggle='tooltip']").tooltip();
    });
    
    StateService.getVendorInfo().then(function() {
    	$scope.vendorDetails = StateService.getVendorDetails();
        $rootScope.$broadcast('generateMapPins');
        $rootScope.$broadcast('forceRefreshMap');
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

    $scope.highlightPins = function(object) {
        if(object && object.marker)
            object.marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    $scope.unHighlightPins = function(object) {
        if(object && object.marker)        
            object.marker.setAnimation(null);
    };    

    $scope.showProductDetailsModal = function(item) {
        $scope.product = item;      
    };

    $scope.hideProductDetailsModal = function() {   
        $scope.product = {};            
    };    

    $scope.likeUnlikeItem = function(item, itemName) {
      StateService.likeUnlikeItem(item, itemName).then(function() {
        item = StateService.getLikedUnlikedItem();
      });
    };

    $scope.trendingMasonry = function() {
      $timeout(function() {
      var container = document.querySelector('#masonry-container');
      var msnry = new Masonry(container, {
        itemSelector: '.ms-item',
        columnWidth: '.ms-item'
      });    
      }, 500)
    };

    $scope.trendingMasonry();

  });

