'use strict';

var app = angular.module('clientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ipCookie',
  'angular.filter',
  'ui.router',
  'ui.bootstrap',
  'mgcrea.ngStrap.timepicker',
])
  .config(function ($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      authenticate: false
    })
    .state('seller', {
      url: '/seller',
      templateUrl: 'views/seller.html',
      controller: 'SellerCtrl',
      authenticate: true
    })
    .state('vendor/details', {
      url: '/vendor/details/{vendorid:[0-9]{1,8}}',
      templateUrl: 'views/details.html',
      controller: 'DetailsCtrl',
      authenticate: false
    });

    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    };    

    // Define the default action to be taken if an unrecognized route is taken.
    $urlRouterProvider.otherwise('/');
  })
  .run(function ($rootScope, $state, AuthService, StateService) {
      OAuth.initialize('tA3E0EDqXdTfZNRn4oUlGCpHJ8E');

      // This will be called every time we start to change state (navigate to a new URL)
      $rootScope.$on('$stateChangeStart', function(event, toState){

        if(StateService.getCurrentUser() === undefined) {
          if(AuthService.isAuthenticated() === true) {
            StateService.setProfileFromCookie();
          }
        }

        if (toState.url === '/seller' && (StateService.getCurrentUser() == undefined || StateService.getUserType() !== 'VEN')) {
          console.log('WHY');
          $state.transitionTo('main', null, {location: 'replace'});
          event.preventDefault();
          return;
        }

        if (toState.authenticate && !AuthService.isAuthenticated()){
          // User isn’t authenticated
          $state.transitionTo('main');
          event.preventDefault();
        }
      });
});

app.directive('holderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.add_theme("big", {background: "#F5F6F1", foreground: "#666", size: 20 });
            Holder.run({ images: element[0], nocss: true });
        }
    };
});
