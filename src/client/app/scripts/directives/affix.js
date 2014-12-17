'use strict';

angular.module('clientApp')
  .directive('affix', function ($window) {
    return {
      restrict: 'A',
      scope: {
        offsetTop: '=',
        containerClass: '@',
        scrollElementClass: '@',
      },
      link: function postLink(scope, element, attrs) {
        scope.doScroll = function() {
            scope.scrollElementHeight = angular.element('.' + scope.scrollElementClass).height(); // Height of element being fixed
            var rowHeight = angular.element(element).closest('.' + scope.containerClass).height(); // Height of container being fixed
            var scroll = angular.element($window).scrollTop(); // Amount in pixels that has been scrolled from the top of the screen

            // Kinda nasty if statement to catch all different cases. There's also a special check in here to make sure we're not on xs screen sizes.
            if(scroll > scope.offsetTop && angular.element($window).width() > 767 && scroll + scope.scrollElementHeight - scope.offsetTop < rowHeight) {
                angular.element(element).css({top: scroll - scope.offsetTop});
            } else if(!(scroll + scope.scrollElementHeight - scope.offsetTop >= rowHeight)) {
                // I don't think we should ever get here, but just in case, we should push the affixed element to the top of the page
                angular.element(element).css({top: 0});
            } 
        }

        // On resize, check to see if we're on XS. If we are, push the affix'd element to the top of the page, otherwise calculate where it should go
        angular.element($window).resize(function() {
          if(angular.element($window).width() < 767) {
            angular.element(element).css({top: 0});
          } else {
            scope.doScroll();
          }
        });        

        // Every time we scroll, calculate the top offset.
        angular.element($window).scroll(function() {
          scope.doScroll();
        });      
      }
    };
  });
