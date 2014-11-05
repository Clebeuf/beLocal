'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http, ipCookie, $location, $q, $timeout) {
    var currentUser = undefined; // Currently authenticated user
    var trendingProducts = []; // Currently trending products
    var vendors = [];
    var marketlist = [];
    var categorylist = [];
    var taglist = [];
    var categoryProductList = [];
    var vendorToDisplay = undefined;
    var vendorDetails = undefined;
    var likedUnlikedItem = undefined;
    var currentLocation = undefined;
    var availableMarkets = undefined;
    var likedUnlikedProduct = undefined;

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

    function compareWeekday(a,b) {
      return a.weekday - b.weekday;
    }

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
        for(var i = 0; i < data.markets.length; i++) {
          data.markets[i].address.hours.sort(compareWeekday);
        }        
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
    
    this.getTags = function() {
      return $http.get(this.getServerAddress() + 'tag/list/')
      .success(function(data) { 
        taglist = data;
        /*var counter = 0;
        while (counter < data.length) {
          taglist.push(data[counter].name);
          counter++;
        } console.log("taglist: %o", taglist);*/
      })
      .error(function(data) {
        console.log('Error retrieving tags');
      });
    };

    this.getCategories = function() {
      return $http.get(this.getServerAddress() + 'category/list/')
      .success(function(data) {
        categorylist = data;
      })
      .error(function(data) {
        console.log('Error retrieving categories');
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
    
    this.getSelectedCategoryProducts = function(category) {
      return $http.get(this.getServerAddress() + 'products/category/' + category.slug + '/')
      .success(function(data) {
        categoryProductList = data;
      })
      .error(function(data) {
        console.log('Error retrieving products of given category!');
      });
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
    
    this.getTagList = function() { 
      return taglist;
    }
    
    this.getCategoryList = function() {
      return categorylist;
    }
    
    this.getSelectedCategoryProductsList = function() {
      return categoryProductList;
    }

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
    
    this.likeUnlikeItem = function(item, itemName) {
      likedUnlikedItem = item;
      if (item.is_liked) {
        // unlike the product
        return $http.delete(this.getServerAddress() + 'like/' + itemName + '/' + item.id + '/')
        .success(function(data, status, headers, config) {
          console.log('Unliked an item! total_likes: ' + data.num_votes);
          likedUnlikedItem.total_likes = data.num_votes;
          likedUnlikedItem.is_liked = null;
        })
        .error(function() {
          console.log('Error unliking item!');
        });
      } else {
        // like the product
        return $http.post(this.getServerAddress() + 'like/' + itemName + '/' + item.id + '/')
        .success(function(data, status, headers, config) {
          console.log('Liked an item! total_likes: '+ data.num_votes);
          likedUnlikedItem.total_likes = data.num_votes;
          likedUnlikedItem.is_liked = true;
        })
        .error(function() {
          console.log('Error liking item!');
        });
      }
    };
    
    this.getLikedUnlikedItem = function() {
      return likedUnlikedItem;
    };

    // Searching Functions
    this.doProductSearch = function(query) {
      return $http.get(this.getServerAddress() + "search/products/?q=" + query)
        .error(function(){
            console.log('Error retrieving product search results!');
        });      
    };

    this.doVendorSearch = function(query) {
      return $http.get(this.getServerAddress() + "search/vendors/?q=" + query)
        .error(function(){
            console.log('Error retrieving vendor search results!');
        });      
    };       
    
  });
