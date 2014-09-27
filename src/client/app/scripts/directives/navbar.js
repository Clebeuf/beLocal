'use strict';

angular.module('clientApp')
  .directive('navBar', function (AuthService) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: ['$scope', function($scope) {
      	$scope.AuthService = AuthService;
      	$scope.showLogin = function() {
      		OAuth.popup('facebook', {cache : true})
		    .done(function (result) {
		    	console.log(result);
		        AuthService.processLogin(result);
		    })
		    .fail(function (error) {
		        console.log(error);
		    });
      	}
      }],
    };
  });
