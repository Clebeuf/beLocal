'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:VendorsearchCtrl
 * @description
 * # VendorsearchCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('VendorsearchCtrl', function ($scope, $http, $stateParams, StateService) {
	$scope.vendors = [];
   	$http.get(StateService.getServerAddress() + "search/vendors/?q=" + $stateParams.q)
   		.then(function(response){
  				$scope.vendors = response.data;
  		});
  });
