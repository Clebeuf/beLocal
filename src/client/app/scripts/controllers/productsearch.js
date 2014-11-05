'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsearchCtrl
 * @description
 * # ProductsearchCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProductsearchCtrl', function ($scope, $http, $stateParams, StateService) {
	$scope.products = [];
   	$http.get(StateService.getServerAddress() + "search/products/?q=" + $stateParams.q)
   		.then(function(response){
  				$scope.products = response.data;
  		});
  });
