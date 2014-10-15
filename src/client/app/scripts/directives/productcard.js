'use strict';

angular.module('clientApp')
  .directive('productCard', function (StateService, $location) {
    return {
      templateUrl: 'scripts/directives/productCard.html',
      restrict: 'E',
      link: function postLink(scope, $state, element, attrs) {	
      	scope.displayVendor = function (id){
      		StateService.setVendorToDisplay(id);
      		$location.path('vendor/details');
      	}
      }
    };
  });
