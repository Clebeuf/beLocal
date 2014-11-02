'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http, ipCookie, $location, $q, $timeout) {
    var currentUser = undefined; // Currently authenticated user
    var trendingProducts = []; // Currently trending products
    var vendors = [];
    var marketlist = [];
    var vendorToDisplay = undefined;
    var vendorDetails = undefined;
    var currentLocation = undefined;
    var availableMarkets = undefined;

    this.getUserPosition = function() {

      var d = $q.defer();

      // Timeout to fire even if the user does not accept/deny location request
      var location_timeout = setTimeout(function() {
        d.resolve(null);
      }, 5000);

      var position; 
        navigator.geolocation.getCurrentPosition(function(pos){
          clearTimeout(location_timeout);          
          position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude).toString();
          $timeout(function(){
            currentLocation = position;
            d.resolve(position);
          });
        },
        function(pos){
          clearTimeout(location_timeout);          
          console.log("Loation permission denied");
          position = undefined;
          $timeout(function(){
            currentLocation = null;
            d.resolve(position);
          })
        },
        {
          maximumAge:0,
          timeout: 5000
        });
      
      return d.promise; 
    }    
    var likedUnlikedProduct = undefined;

    this.clearCurrentUser = function() {
      currentUser = undefined;
    }

    this.updateCurrentUser = function(user) {
      var url = this.getServerAddress() + 'vendor/';        
      return $http({method: 'PATCH', url: url, data: user.vendor})
      .success(function() {
        console.log("Edited User!");
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
      return $http.post(this.getServerAddress() + 'products/trending/', {'user_position':currentLocation})
      .success(function(data) {
        trendingProducts = data;
      })
      .error(function(data) {
        console.log('Error retrieving trending products');
      });
    };

    this.getVendors = function() {
      return $http.post(this.getServerAddress() + 'vendors/', {'user_position':currentLocation})
      .success(function(data) {
        vendors = data;
      })
      .error(function(data) {
        console.log('error retrieving vendors');
      });
    };

    function compareWeekday(a,b) {
      return a.weekday - b.weekday;
    }    

    this.getMarkets = function() {
      return $http.get(this.getServerAddress() + 'markets/')
      .success(function(data) {
        for(var i = 0; i < data.length; i++) {
          data[i].address.hours.sort(compareWeekday);
        }
        marketlist = data;
      })
      .error(function(data) {
        console.log('Error retrieving markets');
      });
    };

    this.getAvailableMarketList = function() {
      return availableMarkets;
    }

    this.getAvailableMarkets = function() {
      return $http.get(this.getServerAddress() + 'vendor/markets/available/')
      .success(function(data) {
        for(var i = 0; i < data.length; i++) {
          data[i].address.hours.sort(compareWeekday);
        }
        availableMarkets = data;
      })
      .error(function(data) {
        console.log('Error retrieving markets');
      });
    };    

    this.getMarketLocations = function() {
      return $http.get(this.getServerAddress() + 'vendor/markets/list/')
      .error(function(data) {
        console.log('Error retrieving seller markets');
      });      
    }

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

    this.joinMarket = function(data) {
      var url = this.getServerAddress() + 'markets/join/';
        return $http.post(url, data)
        .success(function() {
          console.log("Joined a market!");
        })
        .error(function() {
          console.log("Error joining market!");
        })
    }

    this.leaveMarket = function(data) {
      var url = this.getServerAddress() + 'markets/leave/';
        return $http.post(url, data)
        .success(function() {
          console.log("Left a market!");
        })
        .error(function() {
          console.log("Error leaving market!");
        })
    }
    
    this.likeUnlikeProduct = function(product) {
      likedUnlikedProduct = product;
      if (product.is_liked) {
        // unlike the product
        return $http.delete(this.getServerAddress() + 'like/be_local_server-product/' + product.id + '/')
        .success(function(data, status, headers, config) {
          likedUnlikedProduct.vote_total = data.num_votes;
          likedUnlikedProduct.is_liked = null;
        })
        .error(function() {
          console.log('Error unliking product!');
        });
      } else {
        // like the product
        return $http.post(this.getServerAddress() + 'like/be_local_server-product/' + product.id + '/')
        .success(function(data, status, headers, config) {
          likedUnlikedProduct.vote_total = data.num_votes;
          likedUnlikedProduct.is_liked = true;
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
