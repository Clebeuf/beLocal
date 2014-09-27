'use strict';

angular.module('clientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ipCookie'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
    .run(['$window', 'AuthService', 
      function($window, authService) {
        OAuth.initialize('tA3E0EDqXdTfZNRn4oUlGCpHJ8E');
  }]);
