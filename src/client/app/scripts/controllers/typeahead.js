'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TypeaheadCtrl
 * @description
 * # TypeaheadCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('TypeaheadCtrl', function ($scope, $http, StateService) {
  	$scope.getProductSuggestions = function(val) {
  		return $http.get(StateService.getServerAddress() + "search/autocomplete?q=" + val
  			).then(function(response){
  			return response.data.products;
  		});
  	};
  });
