'use strict';

angular.module('clientApp')
  .directive('productCard', function (StateService, $location, $timeout) {
    return {
      templateUrl: 'scripts/directives/productCard.html',
      restrict: 'E',
      link: function postLink(scope, $state, element, attrs) {	

        // Enable/disable liking
        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }

        // Like or unlike a product
        scope.likeUnlikeItem = function(item, itemName) {
          StateService.likeUnlikeItem(item, itemName).then(function() {
            item = StateService.getLikedUnlikedItem();
          });
        };        

        // If the current user is a vendor and they have clicked themselves, take them to their vendor page.
        // Otherwise, take them to the vendor details page for the vendor they have clicked
      	scope.displayVendor = function (id) {
          var user = StateService.getCurrentUser();
          if(user && user.userType === 'VEN' && user.vendor.id === id) {
            $location.path('/vendor');
          } else {            
            $location.path('vendor/details/'+ id);
          }
      	}   

        // Initialize tooltips
        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        });

      }
    };
  });
