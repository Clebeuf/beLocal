'use strict';

angular.module('clientApp')
  .directive('productCard', function (StateService, $location, $timeout) {
    return {
      templateUrl: 'scripts/directives/productCard.html',
      restrict: 'E',
      link: function postLink(scope, $state, element, attrs) {	

        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        } 

      	scope.displayVendor = function (id) {
      		$location.path('vendor/details/'+id).replace();
      	}   

        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        });

      }
    };
  });
