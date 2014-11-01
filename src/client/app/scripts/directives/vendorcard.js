'use strict';
angular.module('clientApp')
  .directive('vendorCard', function (StateService, $timeout) {
    return {
      templateUrl: 'scripts/directives/vendorCard.html',
      restrict: 'E',
      link: function postLink(scope, $state, element, attrs) {
        
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
