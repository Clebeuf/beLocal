'use strict';

angular.module('clientApp')
  .controller('MarketDetailsCtrl', function ($scope, StateService, $stateParams, $location) {

    StateService.getMarketToDisplay($stateParams.marketid).then(function() {
    	$scope.marketDetails = StateService.getMarketDetails();
    	console.log($scope.marketDetails);
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
      $location.path('vendor/details/'+id);
    };        

  });
