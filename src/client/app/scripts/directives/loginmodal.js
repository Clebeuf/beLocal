'use strict';

angular.module('clientApp')
  .directive('loginModal', function (StateService, $timeout, $location, AuthService, $http) {
    return {
      templateUrl: 'scripts/directives/loginmodal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.clearLoginModal = function() {
          scope.loginSubmitted = false;
          scope.loginError = false;
          scope.loginUsername = undefined;
          scope.loginPassword = undefined;
          scope.recoverEmail = undefined;
          scope.emailRecoverError = false;
          scope.emailRecoverMessage = '';
          scope.recoverHasSubmitted = false;
        }       

        scope.signIn = function() {            
          AuthService.showLogin().then(function(status) {              
            if(status === 500) {
              angular.element('#noValidAccountModal').modal('show');
            } else {
              angular.element('#loginModal').modal('hide');                
            }
          });    
        }        

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

        scope.loginSubmit = function() {      
          scope.loginSubmitted = true;
          scope.loginError = false;
          if(scope.loginForm.$valid) {
            AuthService.tryLoginWithoutFaceboook(scope.loginUsername, scope.loginPassword)
            .success(function() {
              angular.element('#loginModal').modal('hide');             
            })
            .error(function() {
              scope.loginError = true;
            });
          }     
        }

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
