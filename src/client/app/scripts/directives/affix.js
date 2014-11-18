'use strict';

angular.module('clientApp')
  .directive('affix', function ($window) {
    return {
      restrict: 'A',
      scope: {
        offsetTop: '=',
        containerClass: '@',
      },
      link: function postLink(scope, element, attrs) {
        angular.element($window).scroll(function() {
            var rowHeight = angular.element(element).closest('.' + scope.containerClass).height();
            var scroll = angular.element($window).scrollTop();
            if(scroll > scope.offsetTop && angular.element($window).width() > 768 && scroll < rowHeight) {
                angular.element(element).css({top: scroll - scope.offsetTop})
            } else {
                angular.element(element).css({top: 0});
            } 
        });      
      }
    };
  });
