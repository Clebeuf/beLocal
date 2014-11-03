'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TypeaheadCtrl
 * @description
 * # TypeaheadCtrl
 * Controller of the clientApp
 */
var app = angular.module('clientApp')
app.controller('TypeaheadCtrl', function ($scope, $http, StateService) {
	$scope.productSuggestions = [];
  	$scope.updateProductSuggestions = function(val) {
  		return $http.get(StateService.getServerAddress() + "search/autocomplete?q=" + val
  			).then(function(response){
  				return response.data.products;
  		});
  	}
  	$scope.onSelect = function($item,$model,$label){
  		window.location.href='search/products/q=' + $item;
  	}
  });

app.filter('finalAppend', function($sce){
  return function(array, value){
  	
	  	if(!(array && value))
            return array;
	    array.push(
	    	$sce.trustAsHtml('Look for <b>' + value + '</b> in other shops')
	    ); 
	    return array;
	  }
});
