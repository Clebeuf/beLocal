'use strict';

angular.module('clientApp')
  .directive('productDetailsModel', function ($model) {
    return {
      templateUrl: 'scripts/directives/productDetails.html',
      restrict: 'A',
      require: '?ngModel',
      scope:{
          ngModel: '='
      },
      link: function postLink(scope, element, attrs) {	
    	  scope.modalId = attrs.modalId;
      }
    };
  });
