'use strict';

angular.module('clientApp')
  .service('AuthService', function AuthService($http, $location, ipCookie, StateService, $q) {
    var self = this;    

    // Performs a login with Facebook
    this.processLogin = function(result) {
    	var loggedIn = false;
    	var backend = 'facebook';
  		var token = "Token " + result.access_token;
  		var loginPromise = $http({method:'POST', url: '//belocalvictoria.me/login/' + backend + '/', headers: {'Authorization': token}});

  		loginPromise.then(function (result) {
  		  loggedIn = true;

        // If the login was successful and we have a user token coming back from the server, set all cookies
  		  if(result.data.token) {
  		  	ipCookie('beLocalToken', result.data.token, {expires: 14});
          ipCookie('beLocalUser', result.data, {expires: 14});
          ipCookie('beLocalBypass', true, {expires: 14});          
  			  $http.defaults.headers.common.Authorization = 'Token ' + result.data.token;
          $http.defaults.headers.patch.Authorization = 'Token ' + result.data.token;          
  		  }
            StateService.setProfile(result.data);		  
  		});

  		return loginPromise;
  	}

    // Creates a new vendor with Facebook
    this.createVendorRequest = function(result) {
      var loggedIn = false;
      var backend = 'facebook';
      var token = "Token " + result.access_token;
      var loginPromise = $http({method:'POST', url: '//belocalvictoria.me/vendor/' + backend + '/create/', headers: {'Authorization': token}});

      // If the login was successful and we have a user token coming back from the server, set all cookies
      loginPromise.then(function (result) {
        loggedIn = true;
        if(result.data.token) {
          ipCookie('beLocalToken', result.data.token, {expires: 14});
          ipCookie('beLocalUser', result.data, {expires: 14});
          ipCookie('beLocalBypass', true, {expires: 14});
        $http.defaults.headers.common.Authorization = 'Token ' + result.token;        
        }
            StateService.setProfile(result.data);     
      });

      return loginPromise;
    }

    // Creates a new customer with Facebook
    this.createCustomerRequest = function(result) {
      var loggedIn = false;
      var backend = 'facebook';
      var token = "Token " + result.access_token;
      var loginPromise = $http({method:'POST', url: '//belocalvictoria.me/customer/' + backend + '/create/', headers: {'Authorization': token}});

      // If the login was successful and we have a user token coming back from the server, set all cookies      
      loginPromise.then(function (result) {        
        loggedIn = true;
        if(result.data.token) {
          ipCookie('beLocalToken', result.data.token, {expires: 14});
          ipCookie('beLocalUser', result.data, {expires: 14});
          ipCookie('beLocalBypass', true, {expires: 14});          
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

    // Performs a full logout and clears all beLocal cookies as well as the OAuth.io cache
    this.logout = function() {
      $location.path('/welcome');
      ipCookie.remove('beLocalToken');
      ipCookie.remove('beLocalUser');
      ipCookie.remove('beLocalBypass');
      delete $http.defaults.headers.common.Authorization;
      StateService.clearCurrentUser();
      OAuth.clearCache('facebook');      
    }

    // This actually pops the Facebook authentication modal for creating a customer
    this.createCustomer = function() {
        var d = $q.defer();

        OAuth.popup('facebook', {cache : true, authorize: {'scope':'email'}})
        .done(function (result) {
            var promise = self.createCustomerRequest(result);
            promise.error(function(response, status) {
              d.resolve(status)
            });
            promise.success(function(response, status) {
              if(status !== 200) {                
              } else {
                if(StateService.getUserType() === 'CUS') {
                    console.log("You're a customer!");
                    $location.path('/');                    
                }
              }         
            });             
        })
        .fail(function (error) {
            console.log(error);
        });

        return d.promise;
    } 

    // Create a vendor without Facebook
    this.createNonFacebookVendor = function(vendor) {
      var loginPromise = $http({method:'POST', url: '//belocalvictoria.me/vendor/no-fb-create/', data: vendor});  
      loginPromise.success(function(result) {
          if(result.token) {
            ipCookie('beLocalToken', result.token, {expires: 14});
            ipCookie('beLocalUser', result, {expires: 14});
            ipCookie('beLocalBypass', true, {expires: 14});
            $http.defaults.headers.common.Authorization = 'Token ' + result.token;        
          }
          StateService.setProfile(result);         
      });
      return loginPromise;      
    } 

    // Create a customer without Facebook
    this.createNonFacebookCustomer = function(customer) {
      var loginPromise = $http({method:'POST', url: '//belocalvictoria.me/customer/no-fb-create/', data: customer});  
      loginPromise.success(function(result) {
          if(result.token) {
            ipCookie('beLocalToken', result.token, {expires: 14});
            ipCookie('beLocalUser', result, {expires: 14});
            ipCookie('beLocalBypass', true, {expires: 14});
            $http.defaults.headers.common.Authorization = 'Token ' + result.token;        
          }
          StateService.setProfile(result);        
      });
      return loginPromise;
    }      

    // This actually pops the Facebook authentication modal for creating a vendor
    this.createVendor = function() {
        var d = $q.defer();

        OAuth.popup('facebook', {cache : true, authorize: {'scope':'email'}})
        .done(function (result) {
            var promise = self.createVendorRequest(result);
            promise.error(function(result, status) {
              d.resolve(status)
            });
            promise.success(function(response, status) {
              if(status !== 200) {
                d.resolve(response);
              } else {
                if(StateService.getUserType() === 'VEN') {
                    $location.path('/vendor');
                }
              }         
            });             
        })
        .fail(function (error) {
            console.log(error);
        });

        return d.promise;
    }    

    // This pops the login modal for Facebook
    this.showLogin = function() {
        var d = $q.defer();

        OAuth.popup('facebook', {cache : true, authorize: {'scope':'email'}})
        .done(function (result) {
            var promise = self.processLogin(result);
            promise.error(function(result, status) {
              d.resolve(status)
            });            
            promise.success(function(response) {
              d.resolve(status)        
            });             
        })
        .fail(function (error) {
            console.log(error);
        });

        return d.promise;        
    } 

    // This attempts to log in without Facebook
    this.tryLoginWithoutFaceboook = function(username, password) {
      var loginPromise = $http.post('//belocalvictoria.me/login-no-fb/', {username: username, password: password});

      loginPromise.then(function (result) {        
        if(result.data.token) {
          ipCookie('beLocalToken', result.data.token, {expires: 14});
          ipCookie('beLocalUser', result.data, {expires: 14});
          ipCookie('beLocalBypass', true, {expires: 14});          
          $http.defaults.headers.common.Authorization = 'Token ' + result.token;        
        }
        StateService.setProfile(result.data);    
      });

      return loginPromise;
    };

  });
