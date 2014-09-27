'use strict';

angular.module('clientApp')
  .service('AuthService', function AuthService($http, $location, ipCookie) {
  	this.processLogin = function(result) {

  		var loggedIn = false;
  		var backend = 'facebook';
		var token = "Token " + result.access_token;
		var loginPromise = $http({method:'POST', url: 'http://127.0.0.1:8000/login/' + backend + '/', headers: {'Authorization': token}});

		// loginService.loginUser(loginPromise);
		loginPromise.success(function (result) {
		  loggedIn = true;
		  if(result.token) {
		  	ipCookie('beLocalToken', result.token, {expires: 14});
			$http.defaults.headers.common.Authorization = 'Token ' + result.token;		  	
		  }
		  console.log(result);
		});
		loginPromise.finally(function () {
		  loggedIn = false;
		});
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
