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
  		AuthService.showLogin().then(function(status) {
        if(status === 500) {
          angular.element('#noValidAccountModal').modal('show');
        }
      });
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

    $scope.signUpAsCustomerModal = function() {
      angular.element('#noValidAccountModal').on('hidden.bs.modal', function(e) {
        $scope.signUpAsCustomer();
      })
      angular.element('#noValidAccountModal').modal('hide');
    }

    $scope.signUpAsVendorModal = function() {
      angular.element('#noValidAccountModal').on('hidden.bs.modal', function(e) {
        $scope.signUpAsVendor();
      })
      angular.element('#noValidAccountModal').modal('hide');
    }  

    $scope.newVendorSubmit = function() {
      $scope.newVendorSubmitted = true;
      if($scope.newVendorForm.$valid) {
        var data = {
          username: $scope.newVendorUserName,
          password: $scope.newVendorPassword,
          first_name: $scope.newVendorFirstName,
          last_name: $scope.newVendorLastName,
          email: $scope.newVendorEmail,
        }
      }
      angular.element('#createVendorModal').on('hidden.bs.modal', function(e) {
        AuthService.createNonFacebookVendor(data);
      });
      
      angular.element('#createVendorModal').modal('hide');      
    }  

  });
