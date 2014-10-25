'use strict';

angular.module('clientApp')
  .controller('WelcomeCtrl', function ($scope, AuthService, $location, ipCookie) {
  	$scope.AuthService = AuthService;

	var url = document.location.toString();
	if (url.match('#')) {
	    angular.element('.masthead-nav a[href="/welcome\/#'+url.split('#')[2]+'"]').tab('show');
	    $location.hash('');
	}  	

  	$scope.signIn = function() {
  		AuthService.showLogin();
  	}

  	$scope.signUpAsCustomer = function() {
  		AuthService.createCustomer().then(function(status) {
  			if(status === 304) {
				angular.element('#accountExistsModal').modal('show'); 				
  			}
  		});
  	}

  	$scope.signUpAsVendor = function() {
  		AuthService.createVendor().then(function(status) {
  			if(status === 304) {
				angular.element('#accountExistsModal').modal('show'); 				
  			}
  		});
  	}

  	$scope.getStarted = function() {
  		ipCookie('beLocalBypass', true, {expires: 14});  		
  		$location.path('/');
  	}

  });
