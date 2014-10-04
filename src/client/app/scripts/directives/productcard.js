'use strict';

angular.module('clientApp')
  .directive('productCard', function () {
    return {
      templateUrl: 'scripts/directives/productCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	console.log(scope.item);	
      }
    };
  });
