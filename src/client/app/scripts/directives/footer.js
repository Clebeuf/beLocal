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
      	scope.emailAddress = "belocal" + "victoria" + "@gmail.com";

      }
    };
  });
