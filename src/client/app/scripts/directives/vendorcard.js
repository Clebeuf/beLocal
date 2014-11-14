'use strict';
angular.module('clientApp')
  .directive('vendorCard', function (StateService, $timeout, $state) {
    return {
      templateUrl: 'scripts/directives/vendorCard.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) { 

        scope.highlightPins = function(vendor) {
          angular.forEach(vendor.markers, function(marker){
              marker.setAnimation(google.maps.Animation.BOUNCE);
          });
        };

        scope.unHighlightPins = function(vendor) {
          angular.forEach(vendor.markers, function(marker){
              marker.setAnimation(null);
          });
        };

        scope.currentState = $state.current;
        
        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }
      }
    };
  });
