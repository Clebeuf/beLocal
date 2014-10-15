'use strict';
angular.module('clientApp')
  .directive('marketCard', function () {
    return {
      templateUrl: 'scripts/directives/marketCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      //	console.log(scope.market);	
      }
    };
  });