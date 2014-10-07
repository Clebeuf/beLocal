'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http, ipCookie) {
    var currentUser = undefined; // Currently authenticated user
    var trendingProducts = []; // Currently trending products

    this.setProfile = function(u) {
      currentUser = u;
    };

    this.getUserType = function() {
      return currentUser.userType;
    };

    this.getCurrentUser = function() {
      return currentUser;
    }

    this.getTrendingProducts = function() {
      return $http.get(this.getServerAddress() + 'products/trending/')
      .success(function(data) {
        trendingProducts = data;
      })
      .error(function(data) {
        console.log('Error retrieving trending products');
      });
    }

    this.getSellerLocations = function() {
      return $http.get(this.getServerAddress() + 'vendor/location/list/')
      .error(function(data) {
        console.log('Error retrieving seller locations');
      }) 
    }

    this.getSellerItems = function() {
      return $http.get(this.getServerAddress() + 'vendor/products/list/')
      .error(function(data) {
        console.log('Error retrieving seller products');
      }) 
    }

    this.getServerAddress = function() {
      return 'http://localhost:8000/';
    }

    this.uploadFile = function(file) {
      var fd = new FormData();
      fd.append('image', file);
      return $http.post(this.getServerAddress() + 'vendor/products/photo/add/', fd, {
        headers: {'Content-Type' : undefined},
        transformRequest: angular.identity,
      })
      .error(function(data) {
        console.log('Error uploading image.');
      })
    }

    this.createItem = function(item) {
      return $http.post(this.getServerAddress() + 'vendor/products/add/', item)
      .success(function() {
        console.log("Created a new item!");
      })
    }

    this.getTrendingProductsList = function() {
      return trendingProducts;
    }

    this.setProfileFromCookie = function() {
      this.setProfile(ipCookie('beLocalUser'));
    }

    this.createSellerLocation = function(sellerLocation, isEditing) {
      if(isEditing) {
        var url = this.getServerAddress() + 'vendor/location/' + sellerLocation.id + '/';
        return $http({method: 'PATCH', url: url, data: sellerLocation})
        .success(function() {
          console.log("Edited a location!");
        })
        .error(function() {
          console.log("Error editing location!");
        })         
      } else {
        return $http.post(this.getServerAddress() + 'vendor/location/add/', sellerLocation)
        .success(function() {
          console.log("Created a new location!");
        })
        .error(function() {
          console.log("Error creating a new location!");
        })        
      }
    }
  });
