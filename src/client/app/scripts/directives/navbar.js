'use strict';

angular.module('clientApp')
  .directive('navBar', function (StateService, AuthService, $location) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/navbar.html',
      controller: ['$scope', function($scope) {
      	$scope.AuthService = AuthService;
      	$scope.loginError = false;

      	$scope.showLogin = function() {
      		OAuth.popup('facebook', {cache : true, authorize: {'scope':'email'}})
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
			            $location.path('/seller');
		            }
		          }        	
		        });		        
		    })
		    .fail(function (error) {
		        console.log(error);
		    });
      	}

      	$scope.createVendor = function() {
      		OAuth.popup('facebook', {cache : true, authorize: {'scope':'email'}})
		    .done(function (result) {
		        AuthService.createVendor(result).then(function(response) {
		          if(response.status !== 200) {
		            $scope.loginError = true;
		            $scope.errorMessage = "We couldn't create a vendor right now! Please try again.";
		          } else {
		            $scope.loginError = false;
		            if(StateService.getUserType() === 'VEN') {
			            $location.path('/seller');
		            }
		          }        	
		        });		        
		    })
		    .fail(function (error) {
		        console.log(error);
		    });
      	}

      	$scope.createCustomer = function() {
      		OAuth.popup('facebook', {cache : true, authorize: {'scope':'email'}})
		    .done(function (result) {
		        AuthService.createCustomer(result).then(function(response) {
		          if(response.status !== 200) {
		            $scope.loginError = true;
		            $scope.errorMessage = "We couldn't create a customer right now! Please try again.";
		          } else {
		            $scope.loginError = false;
		            if(StateService.getUserType() === 'CUS') {
		            	console.log("You're a customer!");
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
