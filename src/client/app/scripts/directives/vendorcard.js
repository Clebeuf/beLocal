'use strict';
angular.module('clientApp')
  .directive('vendorCard', function (StateService, $timeout, $state) {
    return {
      templateUrl: 'scripts/directives/vendorCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) { 

        // Make the pins bounce!
        scope.highlightPins = function(vendor) {
          if(vendor) {
            angular.forEach(vendor.markers, function(marker){
                marker.setAnimation(google.maps.Animation.BOUNCE);
            });
          }
        };

        // Stop the bouncing!
        scope.unHighlightPins = function(vendor) {
          if(vendor) {
            angular.forEach(vendor.markers, function(marker){
                marker.setAnimation(null);
            });
          }
        };

        // Put current state on the scope so that we can display Activate/Deactivate buttons in manager state only
        scope.currentState = $state.current;
        
        // Enable/disable liking
        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }
      }
    };
  });
