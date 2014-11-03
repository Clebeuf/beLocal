'use strict';
angular.module('clientApp')
  .directive('marketCard', function (StateService, $timeout) {
    return {
      templateUrl: 'scripts/directives/marketCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }  

        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        });
        
      }
    };
  });