'use strict';

angular.module('clientApp')
  .controller('WelcomeCtrl', function ($scope, AuthService, StateService, $location, ipCookie, $timeout, $http) {
  	$scope.AuthService = AuthService;

    // Scroll to a DOM element with a specific id
    // 1250 represents the duration of the animation
    $scope.scrollTo = function(id) {
        angular.element('html, body').animate({
            scrollTop: angular.element(id).offset().top
        }, 1250);
    }

    // Check to see if there is a hashtag in the url when coming to this page. If so, it means we have to extract it and scroll
    // to a certain part of the page. (This is how the register dropdown works when you're not signed in)
  	var url = document.location.toString();
  	if (url.split('#')[2]) {
        $timeout(function(){
  	      $scope.scrollTo('#' + url.split('#')[2]);
          $location.hash('');
        }, 250);
  	}

    // Try signing up as a customer with Facebook. If there is already an account associated with the currently authenticated Facebook
    // account, a 304 will be returned from the server, prompting an error message to be displayed.
  	$scope.signUpAsCustomer = function() {
  		AuthService.createCustomer().then(function(status) {
  			if(status === 304) {
          $scope.accountAlreadyCreated = true;
  			}
  		});
  	}

    // Try signing up as a vendor with Facebook. If there is already an account associated with the currently authenticated Facebook
    // account, a 304 will be returned from the server, prompting an error message to be displayed.
  	$scope.signUpAsVendor = function() {
  		AuthService.createVendor().then(function(status) {
  			if(status === 304) {
          $scope.accountAlreadyCreated = true;          
  			}
  		});
  	}

    // Set a flag to sign up as a vendor (this changes the appearance of some modals in the HTML)
    $scope.signUpAsVendorNoFB = function() {
      $scope.accountAlreadyCreated = false;
      $scope.registerAsVendor = true;
    }

    // Set a flag to sign up as a customer (this changes the appearance of some modals in the HTML)
    $scope.signUpAsCustomerNoFB = function() {
      $scope.accountAlreadyCreated = false;
      $scope.registerAsVendor = false;
    }

    // If a user presses the "Start Browsing Now" button, we set a cookie to hide the splash page next time they visit beLocal
  	$scope.getStarted = function() {
  		ipCookie('beLocalBypass', true, {expires: 14});  		
  		$location.path('/');
  	}  

    // Create a new vendor without Facebook
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
        // Catch any serverside errors and display them on the client (duplicate email/username are the only things we check for currently)
        if(response.username) {
          $scope.usernameErrorMessage = response.username[0];
        } else if(response.email) {
          $scope.emailErrorMessage = response.email;
        }                  
      });
    } 

    // Create a new customer without Facebook
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
        // Set a flag to sign up as a vendor (this changes the appearance of some modals in the HTML)
        if(response.username) {
          $scope.usernameErrorMessage = response.username[0];
        } else if(response.email) {
          $scope.emailErrorMessage = response.email;
        }          
      });   
    } 

    // When the create user modal is hidden, check to see what kind of user we have just created, and redirect to the appropriate page in beLocal.
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
