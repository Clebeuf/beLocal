'use strict';

angular.module('clientApp')
  .directive('productDetailsModal', function ($timeout, $location, StateService, $state) {
    return {
      templateUrl: 'scripts/directives/productDetailsModal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        // Enable/disable liking
        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }        

        // Called when a tag in a product details modal is clicked. This will redirect to the main page (if necessary)
        // and perform a tag filtering for the tag that was just clicked
      	scope.redirectTagFilter = function(tagName) {
      	  StateService.setTagToDisplay(tagName);
	      	angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
	        $timeout(function() {
            if(tagName && $state.current.name === 'main') {
              $location.hash('trending');
              scope.selectedTags = [];
              scope.doTagFilter(tagName);
              tagName = undefined;
            } else {
	      	    $state.transitionTo('main', {reload: true});
            }
	        });
	      });
	      angular.element('#productDetailsModal').modal('hide');
      }

      // Like or unlike a product
      scope.likeUnlikeItem = function(item, itemName) {
        StateService.likeUnlikeItem(item, itemName).then(function() {
          item = StateService.getLikedUnlikedItem();
        });
      };          

    // If the current user is a vendor and they have clicked themselves, take them to their vendor page.
    // Otherwise, take them to the vendor details page for the vendor they have clicked      
	    scope.goToVendorDetails = function(vendorID){
	      angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
	        $timeout(function() {
            var user = StateService.getCurrentUser();
            if(user && user.userType === 'VEN' && user.vendor.id === vendorID) {
              $location.path('/vendor');
            } else {            
	      	    $location.path('vendor/details/'+ vendorID);
            }
	        });
	      });
	      angular.element('#productDetailsModal').modal('hide');
      }
    }
  }
});
