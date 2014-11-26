'use strict';

angular.module('clientApp')
  .controller('WelcomeCtrl', function ($scope, AuthService, StateService, $location, ipCookie, $timeout, $http) {
  	$scope.AuthService = AuthService;

  	var url = document.location.toString();
  	if (url.match('#')) {
  	    angular.element('.masthead-nav a[href="/welcome\/#'+url.split('#')[2]+'"]').tab('show');
  	    $location.hash('');
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

    $scope.newVendorSubmit = function() {
      $scope.newUserSubmitted = true;
      $scope.usernameErrorMessage = null;
      $scope.emailErrorMessage = null;      
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
        } else if(response.email) {
          $scope.emailErrorMessage = response.email;
        }                  
      });
    } 

    $scope.newCustomerSubmit = function() {
      $scope.newUserSubmitted = true;
      $scope.usernameErrorMessage = null;
      $scope.emailErrorMessage = null;
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
        } else if(response.email) {
          $scope.emailErrorMessage = response.email;
        }          
      });   
    } 

    angular.element('#createUserModal').on('hidden.bs.modal', function(e) {
      $timeout(function() {
        if(StateService.getCurrentUser()){        
          if(StateService.getUserType() === 'CUS') {
              $timeout(function() {
                $location.path('/');                    
              });
          } else if(StateService.getUserType() === 'VEN') {
              $timeout(function() {
                $location.path('/vendor');
              });
          }
          else if(StateService.getUserType() === 'SUP') {
              $timeout(function() {
                $location.path('/manage');
              });
          }
        }
      });
    });
  });
