'use strict';

var app = angular.module('clientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ipCookie',
  'angular.filter',
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

app.directive('holderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run({ images: element[0], nocss: true });
        }
    };
});
