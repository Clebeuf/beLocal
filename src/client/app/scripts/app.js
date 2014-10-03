'use strict';

angular.module('clientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ipCookie',
  'mgcrea.ngStrap',
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/seller',{
        templateUrl: 'views/seller.html',
        controller: 'SellerCtrl'
      })
      .otherwise({
        templateUrl: '404.html'
      });
  })
    .run(['$window', 'AuthService', 
      function($window, authService) {
        OAuth.initialize('tA3E0EDqXdTfZNRn4oUlGCpHJ8E');
  }]);
