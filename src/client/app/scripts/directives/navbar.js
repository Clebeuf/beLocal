'use strict';

angular.module('clientApp')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: function postLink(scope, element, attrs) {
        element.text('this is the navBar directive');
      }
    };
  });
