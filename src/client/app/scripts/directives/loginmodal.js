'use strict';

angular.module('clientApp')
  .directive('loginModal', function (StateService, $timeout, $location, AuthService, $http) {
    return {
      templateUrl: 'scripts/directives/loginmodal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        // Reset login modal
        scope.clearLoginModal = function() {
          scope.noFacebookAccountError = false;                
          scope.loginSubmitted = false;
          scope.loginError = false;
          scope.loginUsername = undefined;
          scope.loginPassword = undefined;
          scope.recoverEmail = undefined;
          scope.emailRecoverError = false;
          scope.emailRecoverMessage = '';
          scope.recoverHasSubmitted = false;
          scope.loginErrorMessage = null;
        }       

        // Try to sign in with Facebook
        scope.signIn = function() {  
          scope.noFacebookAccountError = false;          
          AuthService.showLogin().then(function(status) {              
            if(status === 500) {
              scope.noFacebookAccountError = true;
            } else {
              angular.element('#loginModal').modal('hide');                
            }
          });    
        }        

        // After the modal closes, redirect to the appropriate page depending on which type of user just logged in
        angular.element('#loginModal').on('hidden.bs.modal', function(e) {
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

        // Login without Facebook
        scope.loginSubmit = function() { 
          scope.loginErrorMessage = null;     
          scope.loginSubmitted = true;
          scope.loginError = false;
          if(scope.loginForm.$valid) {
            AuthService.tryLoginWithoutFaceboook(scope.loginUsername, scope.loginPassword)
            .success(function() {
              angular.element('#loginModal').modal('hide');             
            })
            .error(function(response) {
              scope.loginError = true;
              if(response.non_field_errors)
                scope.loginErrorMessage = response.non_field_errors[0];
            });
          }     
        }

        // Send password recovery email
        scope.recoverInformation = function() {
          scope.emailRecoverError = false;
          scope.emailRecoverMessage = '';      
          scope.recoverHasSubmitted = true;

          if(scope.recoverInfoForm.$valid) {
            $http.post(StateService.getServerAddress() + 'users/password/reset/', {'email' : scope.recoverEmail})
              .success(function (data, status) {           
                console.log("Sent recovery email");       
                angular.element('#loginModal').modal('hide');   
                scope.recoverHasSubmitted = false;
              })
              .error(function (data, status, headers, config) {
                // If there's been an error, time to display it back to the user on the form. (These are where server side errors are set)
                var h = headers();
                if(h['error-type'] === 'email') {
                  scope.emailRecoverError = true;
                  scope.emailRecoverMessage = h['error-message'];
                }
            });   
          }   
        }
      }
    };
  });

angular.module('clientApp').directive('enterKey', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.enterKey, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
});
