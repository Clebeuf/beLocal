'use strict';

angular.module('clientApp')
  .directive('productDetailsModal', function ($timeout, $location) {
    return {
      templateUrl: 'scripts/directives/productDetailsModal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

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
