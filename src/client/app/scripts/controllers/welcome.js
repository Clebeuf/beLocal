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
      angular.element('#loginModal').on('hidden.bs.modal', function(e) {      
    		AuthService.showLogin().then(function(status) {
          if(status === 500) {
            angular.element('#noValidAccountModal').modal('show');
          }
        });
      });
      angular.element('#loginModal').modal('hide');      
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

    $scope.signUpAsVendorNoFB = function() {
      $scope.signUpAsVendor = true;
    }

    $scope.signUpAsCustomerNoFB = function() {
      $scope.signUpAsVendor = false;
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
      $scope.newUserSubmitted = true;
      if($scope.newUserForm.$valid) {
        var data = {
          username: $scope.newVendorUserName,
          password: $scope.newVendorPassword,
          first_name: $scope.newVendorFirstName,
          last_name: $scope.newVendorLastName,
          email: $scope.newVendorEmail,
        }
      }
      AuthService.createNonFacebookVendor(data)
      .success(function() {
        angular.element('#createUserModal').modal('hide');  
      })
      .error(function(response) {
        if(response.username) {
          $scope.usernameErrorMessage = response.username[0];
        }          
      });
    } 

    $scope.newCustomerSubmit = function() {
      $scope.newUserSubmitted = true;
      if($scope.newUserForm.$valid) {
        var data = {
          username: $scope.newVendorUserName,
          password: $scope.newVendorPassword,
          first_name: $scope.newVendorFirstName,
          last_name: $scope.newVendorLastName,
          email: $scope.newVendorEmail,
        }
      }
      AuthService.createNonFacebookCustomer(data)
      .success(function() {
        angular.element('#createUserModal').modal('hide');  
      })
      .error(function(response) {
        if(response.username) {
          $scope.usernameErrorMessage = response.username[0];
        }          
      });    
    }     

    $scope.loginSubmit = function() {      
      $scope.loginSubmitted = true;
      $scope.loginError = false;
      if($scope.loginForm.$valid) {
        AuthService.tryLoginWithoutFaceboook($scope.loginUsername, $scope.loginPassword)
        .success(function() {
          angular.element('#loginModal').modal('hide');              
        })
        .error(function() {
          $scope.loginError = true;
        });
      }  
    } 

  });
