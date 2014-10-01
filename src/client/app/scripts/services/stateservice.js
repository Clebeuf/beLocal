'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http) {
    var currentUser = {}; // Currently authenticated user
    var trendingProducts = []; // Currently trending products

    this.setProfile = function(u) {
      currentUser = u;
    };

    this.getUserType = function() {
      return currentUser.userType;
    };

    this.getTrendingProducts = function() {
      return $http.get(this.getServerAddress() + 'products/trending/')
      .success(function(data) {
        trendingProducts = data;
      })
      .error(function(data) {
        console.log('Error retrieving trending products');
      });
    }

    this.getServerAddress = function() {
    	return 'http://localhost:8000/';
    }

    this.getTrendingProductsList = function() {
    	return trendingProducts;
    }

  });
