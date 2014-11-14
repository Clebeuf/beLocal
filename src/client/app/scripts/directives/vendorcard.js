'use strict';
angular.module('clientApp')
  .directive('vendorCard', function (StateService, $timeout, $state) {
    return {
      templateUrl: 'scripts/directives/vendorCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {   

        scope.currentState = $state.current;
        
        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }
      }
    };
  });
