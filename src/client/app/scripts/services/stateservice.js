'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http, ipCookie, $location) {
    var currentUser = undefined; // Currently authenticated user
    var trendingProducts = []; // Currently trending products
    var vendors = [];
    var marketlist = [];
    var vendorToDisplay = undefined;
    var vendorDetails = undefined;
    var likedUnlikedProduct = undefined;



    this.updateCurrentUser = function(user) {
      var url = this.getServerAddress() + 'vendor/';        
      return $http({method: 'PATCH', url: url, data: user.vendor})
      .success(function() {
        console.log("Edited User! yay!");
      }); 
    };


    this.setVendorToDisplay = function(vendorID) {
      vendorToDisplay = vendorID;
    };

    this.getVendorDetails = function(){
      return vendorDetails;
    };

    this.getVendorInfo = function(){
      return $http.post(this.getServerAddress() + 'vendor/details', {"id":vendorToDisplay})
      .success(function(data) {
        vendorDetails = data;
      })
      .error(function(data) {
        console.log('Error retrieving vendor info');
        $location.path('/');
      });
    };

    this.getVendorInfoToDisplay = function(){
      return vendorToDisplayInfo;
    };

    this.setProfile = function(u) {
      currentUser = u;
    };

    this.setProfileVendor = function(u) {
      currentUser.vendor = u;
      ipCookie('beLocalUser', currentUser, {expires: 14});
    };

    this.getUserType = function() {
      return currentUser.userType;
    };

    this.getCurrentUser = function() {
      return currentUser;
    };

    this.getTrendingProducts = function() {
      return $http.get(this.getServerAddress() + 'products/trending/')
      .success(function(data) {
        trendingProducts = data;
      })
      .error(function(data) {
        console.log('Error retrieving trending products');
      });
    };

    this.getVendors = function() {
      return $http.get(this.getServerAddress() + 'vendors/')
      .success(function(data) {
        vendors = data;
      })
      .error(function(data) {
        console.log('Error retrieving vendors');
      });
    };

    this.getMarkets = function() {
      return $http.get(this.getServerAddress() + 'markets/')
      .success(function(data) {
        marketlist = data;
      })
      .error(function(data) {
        console.log('Error retrieving markets');
      });
    };

    this.getSellerLocations = function() {
      return $http.get(this.getServerAddress() + 'vendor/location/list/')
      .error(function(data) {
        console.log('Error retrieving seller locations');
      }); 
    };

    this.trashOrRestoreLocation = function(id, action) {
      return $http.post(this.getServerAddress() + 'vendor/location/delete/', {'id' : id, 'action' : action})
      .error(function(data) {
        console.log('Error deleting location');
      });
    };

    this.trashOrRestoreProduct = function(id, action) {
      return $http.post(this.getServerAddress() + 'vendor/products/delete/', {'id' : id, 'action' : action})
      .error(function(data) {
        console.log('Error deleting product');
      });
    };    

    this.updateStockValue = function(productId, value) {
      return $http.post(this.getServerAddress() + 'vendor/products/stock/', {'product_id' : productId, 'value' : value})
      .error(function(data) {
        console.log('Error updating product stock');
      });
    };

    this.getSellerItems = function() {
      return $http.get(this.getServerAddress() + 'vendor/products/list/')
      .error(function(data) {
        console.log('Error retrieving seller products');
      });
    };

    this.getServerAddress = function() {
      return 'http://localhost:8000/';
    };

    this.uploadFile = function(file) {
      var fd = new FormData();
      fd.append('image', file);
      return $http.post(this.getServerAddress() + 'vendor/products/photo/add/', fd, {
        headers: {'Content-Type' : undefined},
        transformRequest: angular.identity,
      })
      .error(function(data) {
        console.log('Error uploading image.');
      });
    };

    this.uploadProfileFile = function(file) {
      var fd = new FormData();
      fd.append('image', file);
      return $http.post(this.getServerAddress() + 'vendor/photo/add/', fd, {
        headers: {'Content-Type' : undefined},
        transformRequest: angular.identity,
      })
      .error(function(data) {
        console.log('Error uploading image.');
      })
    };    

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
    };

    this.getTrendingProductsList = function() {
      return trendingProducts;
    };

    this.getVendorsList = function() {
      return vendors;
    };

    this.getMarketList = function() {
      return marketlist;
    };

    this.setProfileFromCookie = function() {
      this.setProfile(ipCookie('beLocalUser'));
    };

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
    };
    
    this.likeUnlikeProduct = function(product) {
      likedUnlikedProduct = product;
      if (product.isLiked) {
        // unlike the product
        return $http.delete(this.getServerAddress() + 'like/be_local_server-product/' + product.id + '/')
        .success(function(data, status, headers, config) {
          console.log('Unliked a product! total_likes: ' + data.num_votes);
          likedUnlikedProduct.vote_total = data.num_votes;
          likedUnlikedProduct.isLiked = null;
        })
        .error(function() {
          console.log('Error unliking product!');
        });
      } else {
        // like the product
        return $http.post(this.getServerAddress() + 'like/be_local_server-product/' + product.id + '/')
        .success(function(data, status, headers, config) {
          console.log('Liked a product! total_likes: '+ data.num_votes);
          likedUnlikedProduct.vote_total = data.num_votes;
          likedUnlikedProduct.isLiked = true;
        })
        .error(function() {
          console.log('Error liking product!');
        });
      }
    };
    
    this.getLikedUnlikedProduct = function() {
      return likedUnlikedProduct;
    };
    
  });
