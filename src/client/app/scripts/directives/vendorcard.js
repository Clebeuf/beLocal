'use strict';
angular.module('clientApp')
  .directive('vendorCard', function () {
    return {
      templateUrl: 'scripts/directives/vendorCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
