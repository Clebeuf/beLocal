'use strict';

angular.module('clientApp')
  .service('AuthService', function AuthService($http, $location, ipCookie, StateService) {
  	this.processLogin = function(result) {

  		var loggedIn = false;
  		var backend = 'facebook';
		var token = "Token " + result.access_token;
		var loginPromise = $http({method:'POST', url: 'http://127.0.0.1:8000/login/' + backend + '/', headers: {'Authorization': token}});

		// loginService.loginUser(loginPromise);
		loginPromise.then(function (result) {
		  loggedIn = true;
		  if(result.data.token) {
		  	ipCookie('beLocalToken', result.data.token, {expires: 14});
			$http.defaults.headers.common.Authorization = 'Token ' + result.token;		  	
		  }
          StateService.setProfile(result.data);		  
		});

		return loginPromise;
  	}

    // Check to see if the user is authenticated. If so, set the http Authorization header to include their token.
    this.isAuthenticated = function() {
      var authToken = ipCookie('beLocalToken');
      if(authToken !== undefined) {
        $http.defaults.headers.common.Authorization = 'Token ' + authToken;
        return true;
      } else {
        return false;
      }
    };

    this.logout = function() {
      ipCookie.remove('beLocalToken');
      delete $http.defaults.headers.common.Authorization;
      $location.path('/');  	
    }
  });
