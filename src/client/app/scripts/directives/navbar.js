'use strict';

angular.module('clientApp')
  .directive('navBar', function (StateService, AuthService) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: ['$scope', function($scope) {
      	$scope.AuthService = AuthService;
      	$scope.loginError = false;

      	$scope.showLogin = function() {
      		OAuth.popup('facebook', {cache : true})
		    .done(function (result) {
		        AuthService.processLogin(result).then(function(response) {
		          if(response.status !== 200) {
		            $scope.loginError = true;
		            $scope.errorMessage = "We couldn't sign you in with Facebook right now! Please try again.";
		          } else {
		            $scope.loginError = false;
		            if(StateService.getUserType() === 'CUS') {
		            	console.log("You're a customer!");
		              // $location.path('/customer');
		            } else if(StateService.getUserType() === 'VEN') {
		            	console.log("You're a seller!");
		              // $location.path('/seller');
		            }
		          }        	
		        });		        
		    })
		    .fail(function (error) {
		        console.log(error);
		    });
      	}
      }],
    };
  });
