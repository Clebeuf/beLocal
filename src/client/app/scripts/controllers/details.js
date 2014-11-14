'use strict';

angular.module('clientApp')
  .controller('DetailsCtrl', function ($scope, $timeout, $stateParams, StateService, $rootScope) {

    StateService.setVendorToDisplay($stateParams.vendorid);

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
        object.marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    $scope.unHighlightPins = function(object) {
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

    $timeout(function() {
		var container = document.querySelector('#masonry-container');
		var msnry = new Masonry(container, {
		  itemSelector: '.ms-item',
		  columnWidth: '.ms-item'
		});    
    }, 1000)

  });

