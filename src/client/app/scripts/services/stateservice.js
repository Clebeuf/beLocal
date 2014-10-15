'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http, ipCookie) {
    var currentUser = undefined; // Currently authenticated user
    var trendingProducts = []; // Currently trending products
    var vendors = [];
    var marketlist = [];

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

    this.getVendors = function() {
      return $http.get(this.getServerAddress() + 'vendors/')
      .success(function(data) {
        vendors = data;
      })
      .error(function(data) {
        console.log('Error retrieving vendors');
      });
    }

    this.getMarkets = function() {
      return $http.get(this.getServerAddress() + 'markets/')
      .success(function(data) {
        marketlist = data;
      })
      .error(function(data) {
        console.log('Error retrieving markets');
      });
    }

    this.getSellerLocations = function() {
      return $http.get(this.getServerAddress() + 'vendor/location/list/')
      .error(function(data) {
        console.log('Error retrieving seller locations');
      }) 
    }

    this.trashOrRestoreLocation = function(id, action) {
      return $http.post(this.getServerAddress() + 'vendor/location/delete/', {'id' : id, 'action' : action})
      .error(function(data) {
        console.log('Error deleting location');
      })
    }

    this.trashOrRestoreProduct = function(id, action) {
      return $http.post(this.getServerAddress() + 'vendor/products/delete/', {'id' : id, 'action' : action})
      .error(function(data) {
        console.log('Error deleting product');
      })
    }    

    this.updateStockValue = function(product_id, value) {
      return $http.post(this.getServerAddress() + 'vendor/products/stock/', {'product_id' : product_id, 'value' : value})
      .error(function(data) {
        console.log('Error updating product stock');
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

    this.createItem = function(item, isEditing) {
      if(isEditing) {
        var url = this.getServerAddress() + 'vendor/products/' + item.id + '/';        
        return $http({method: 'PATCH', url: url, data: item})
        .success(function() {
          console.log("Edited item!");
        });        
      } else {
        return $http.post(this.getServerAddress() + 'vendor/products/add/', item)
        .success(function() {
          console.log("Created a new item!");
        });
      }
    }

    this.getTrendingProductsList = function() {
      return trendingProducts;
    }

    this.getVendorsList = function() {
      return vendors;
    }

    this.getMarketList = function() {
      return marketlist;
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
