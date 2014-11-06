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
    .state('vendorDetails', {
      url: '/vendor/details/{vendorid:[0-9]{1,8}}',
      templateUrl: 'views/details.html',
      controller: 'DetailsCtrl',
      authenticate: false,
      css: 'styles/main.css'
    })
    .state('search', {
      url: '/search/{search_type}?q',
      templateUrl: 'views/search.html',
      controller: 'SearchCtrl',
      authenticate: false,
      css: 'styles/main.css'
    })
    .state('marketDetails', {
      url: '/market/details/{marketid:[0-9]{1,8}}',
      templateUrl: 'views/marketdetails.html',
      controller: 'MarketDetailsCtrl',
      authenticate: false,
      css: 'styles/main.css'
    });

    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    };    

    // Define the default action to be taken if an unrecognized route is taken.
    $urlRouterProvider.otherwise('/');
  })

  .run(function ($rootScope, $state, $location, AuthService, StateService, ipCookie) {
      OAuth.initialize('FFQwiNbZnNhnZMbxNeUWxjQVSjk');

      // This will be called every time we start to change state (navigate to a new URL)
      $rootScope.$on('$stateChangeStart', function(event, toState){

        // Clear query parameter on navigation away from the search page
        if(toState.name != 'search')
          $location.search('q', null); 

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

/* FILTERS */

/* Filter Multiple fields */
app.filter('filterMultiple',['$filter',function ($filter) {
  return function (items, keyObj) { 
    var filterObj = {
      filteredData:items,
      
      applyFilter : function(obj,key){
        var fData = [];        
        if(obj){
          var fObj = {};
          if(angular.isString(obj)){
            fObj[key] = obj; 
            this.filteredData = $filter('filter')(this.filteredData,fObj); 
          } 
          else if(angular.isArray(obj)){
            if(obj.length > 0){     
              for(var i=0;i<obj.length;i++){
                if(angular.isString(obj[i])){
                  fObj[key] = obj[i]; 
                  this.filteredData = $filter('filter')(this.filteredData,fObj);        
                }
              }    
            }
          }
        }
       }
    };
    
    var isEmpty = function(obj){
      for(var i in obj){ return false;}
      return true;
    };
    
    if (isEmpty(keyObj)) { 
      return items;        
    }
    else if(keyObj){               
      angular.forEach(keyObj,function(obj,key){ 
        filterObj.applyFilter(obj,key);
      });      
      return filterObj.filteredData;
    } 
    else { 
      return items;
    }
    
  }
}]); 


