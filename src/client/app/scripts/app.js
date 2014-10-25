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
  .config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    $stateProvider
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'views/welcome.html',
      controller: 'WelcomeCtrl',
      authenticate: false,
      css: 'styles/welcome.css'
    })    
    .state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      authenticate: false,
      css: 'styles/main.css'      
    })
    .state('vendor', {
      url: '/vendor',
      templateUrl: 'views/seller.html',
      controller: 'SellerCtrl',
      authenticate: true,
      css: 'styles/main.css' 
    })
    .state('vendor/details', {
      url: '/vendor/details/{vendorid:[0-9]{1,8}}',
      templateUrl: 'views/details.html',
      controller: 'DetailsCtrl',
      authenticate: false,
      css: 'styles/main.css'
    });


    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    };    

    // Define the default action to be taken if an unrecognized route is taken.
    $urlRouterProvider.otherwise('/');
  })
  .run(function ($rootScope, $state, AuthService, StateService, ipCookie, $location) {
      OAuth.initialize('tA3E0EDqXdTfZNRn4oUlGCpHJ8E');

      // This will be called every time we start to change state (navigate to a new URL)
      $rootScope.$on('$stateChangeStart', function(event, toState){

        if(toState.url == '/' && ipCookie('beLocalBypass') === undefined) {
          $location.path('welcome');
          return;
        }

        if(StateService.getCurrentUser() === undefined) {
          if(AuthService.isAuthenticated() === true) {
            StateService.setProfileFromCookie();
          }
        }

        if (toState.url === '/seller' && (StateService.getCurrentUser() == undefined || StateService.getUserType() !== 'VEN')) {
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

app.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(stateCtrl, cssUrl) in stateStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.stateStyles = {};
                $rootScope.$on('$stateChangeStart', function (e, next, nextParams, current) {
                    if(current && current.css){
                        if(!Array.isArray(current.css)){
                            current.css = [current.css];
                        }
                        angular.forEach(current.css, function(sheet){
                            delete scope.stateStyles[sheet];
                        });
                    }
                    if(next && next.css){
                        if(!Array.isArray(next.css)){
                            next.css = [next.css];
                        }
                        angular.forEach(next.css, function(sheet){
                            scope.stateStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);
