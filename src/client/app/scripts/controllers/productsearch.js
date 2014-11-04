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
    $scope.getProducts = function() {
    	return ['hello'];
    	// return $http.get(StateService.getServerAddress() + "search/products?q=" + $stateParams.q
  			// ).then(function(response){
  			// 	return ['hello']
  			// });
    }
  });
