'use strict';

angular.module('clientApp')
  .directive('productCard', function (StateService, $location, $timeout) {
    return {
      templateUrl: 'scripts/directives/productCard.html',
      restrict: 'E',
      link: function postLink(scope, $state, element, attrs) {	

        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }

        scope.likeUnlikeItem = function(item, itemName) {
          StateService.likeUnlikeItem(item, itemName).then(function() {
            item = StateService.getLikedUnlikedItem();
          });
        };        

      	scope.displayVendor = function (id) {
          var user = StateService.getCurrentUser();
          if(user && user.userType === 'VEN' && user.vendor.id === id) {
            $location.path('/vendor');
          } else {            
            $location.path('vendor/details/'+ id);
          }
      	}   

        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        });

      }
    };
  });
