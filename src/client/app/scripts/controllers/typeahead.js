'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TypeaheadCtrl
 * @description
 * # TypeaheadCtrl
 * Controller of the clientApp
 */
var app = angular.module('clientApp')
app.controller('TypeaheadCtrl', function ($scope, $http, StateService, $sce) {
	$scope.productSuggestions = [];
  	$scope.updateProductSuggestions = function(val) {
  		return $http.get(StateService.getServerAddress() + "search/autocomplete?q=" + val
  			).then(function(response){
  				var products = response.data.products;
  				products.push({
  					name: $sce.trustAsHtml('Look for <b>' + val + '</b> in vendors'),
  					vendorSearch: val
  				});
  				return products;
  		});
  	}
  	$scope.onSelect = function($item,$model,$label){

  		if($item.vendorSearch != null) {
  			window.location.href='#/search/vendors?q=' + $item.vendorSearch;
  		} else {
  			window.location.href='#/search/products?q=' + $item.name;
  		}

  		
  		
  	}
  });
