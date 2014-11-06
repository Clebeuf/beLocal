'use strict';

angular.module('clientApp')
  .directive('productDetailsModal', function ($timeout, $location, StateService, $state) {
    return {
      templateUrl: 'scripts/directives/productDetailsModal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      	scope.redirectTagFilter = function(tagName) {
      	  StateService.setTagToDisplay(tagName);
	      	angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
	        $timeout(function() {
            if($state.current.name === 'main') {
              scope.selectedTags = [];
              scope.doTagFilter(tagName);
            } else {
	      	    $state.transitionTo('main', {reload: true});
            }
	        });
	      });
	      	angular.element('#productDetailsModal').modal('hide');
      	}

	    scope.goToVendorDetails = function(vendorID){
	    	
	      angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
	        $timeout(function() {
	      	 $location.path('vendor/details/'+ vendorID).replace();
	        });
	      });
	      angular.element('#productDetailsModal').modal('hide');

	    }

      }
    };
  });
