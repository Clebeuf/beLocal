'use strict';

angular.module('clientApp')
  .controller('ContactusCtrl', function ($scope, $location, $timeout, StateService, $q, $rootScope, $window) {
    $scope.showXSNav = false;
    $scope.emailAddress = "belocal" + "victoria" + "@gmail.com";


    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

	$scope.checkNav = function() {
      if(angular.element($window).scrollTop() > 140 || angular.element($window).width() < 768) {
        $scope.safeApply(function() {
          $scope.showXSNav = true;
        });
      } else {
        $scope.safeApply(function() {
          $scope.showXSNav = false;
        })
      }        
    }

    if(angular.element($window).width() < 768) {
      $scope.safeApply(function() {
        $scope.showXSNav = true;
      });
    }            

    angular.element($window).resize(function() {
        $scope.checkNav();
    });    

    angular.element($window).scroll(function(){
        $scope.checkNav();        
    });


  });
