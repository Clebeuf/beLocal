'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SellerCtrl
 * @description
 * # SellerCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SellerCtrl', function ($scope) {
  	$scope.opened = false;
  	$scope.minDate = new Date();
  	$scope.locationDate = new Date();
  	var tempDate = new Date();
  	tempDate.setHours(tempDate.getHours() + 1);

	$scope.roundTimeToNearestFive = function(date) {
	  var coeff = 1000 * 60 * 5;
	  return new Date(Math.round(date.getTime() / coeff) * coeff);
	};

  	$scope.startTime = $scope.roundTimeToNearestFive(new Date());
  	$scope.endTime = $scope.roundTimeToNearestFive(tempDate);

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};

	$scope.newLocationSubmit = function() {
		$scope.newLocationSubmitted = true;
		console.log('Submitted');
	}

  });
