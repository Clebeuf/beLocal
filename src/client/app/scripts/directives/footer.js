'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:footer
 * @description
 * # footer
 */
angular.module('clientApp')
  .directive('footer', function () {
    return {
      templateUrl: 'scripts/directives/footer.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	// Email address! No hardcoding this because spam is bad.
      	scope.emailAddress = "belocal" + "victoria" + "@gmail.com";

      }
    };
  });
