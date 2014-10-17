'use strict';

angular.module('clientApp')
  .directive('productCard', function (StateService, $location) {
    return {
      templateUrl: 'scripts/directives/productCard.html',
      restrict: 'E',
      link: function postLink(scope, $state, element, attrs) {	
      	scope.displayVendor = function (id){
      		$location.path('vendor/details/'+id).replace();
      	}      	
      }
    };
  });
