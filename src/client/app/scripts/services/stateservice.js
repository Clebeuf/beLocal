'use strict';

angular.module('clientApp')
  .service('StateService', function StateService($http, ipCookie, $location, $q, $timeout) {
    var currentUser = undefined; // Currently authenticated user
    var trendingProducts = []; // Currently trending products
    var vendors = []; // List of vendors coming back from the server
    var marketlist = []; // List of markets coming from the markets
    var categorylist = []; // List of categories coming from the server
    var taglist = []; // List of tags coming from the server
    var categoryProductList = []; // List of products in a specific category 
    var tagProductList = []; // List of products with a specific tag
    var vendorToDisplay = undefined; // Vendor ID to display (used when navigating to a new page)
    var vendorDetails = undefined; // Vendor details object coming back from the server
    var likedUnlikedItem = undefined; // Item to be liked/unliked
    var currentLocation = undefined; // User's current location
    var availableMarkets = []; // Markets that are currently available to be joined
    var likedUnlikedProduct = undefined; // Product that is to be liked/unliked
    var marketDetails = undefined; // Market details returned from the server
    var tagToDisplay = undefined; // Tag to display (used when navigating to a new page)

    // Makes the serverside call to delete a user
    this.deleteUser = function(userID) {
      return $http.post(this.getServerAddress() + 'users/delete/', {'id':userID}) 
    }

    // Returns our email!
    this.getContactEmail = function() {
      return 'belocalvictoria' + '@' + 'gmail.com';
    }

    // Sets a specific tag to be displayed
    this.setTagToDisplay = function(tagName) {
      tagToDisplay = tagName;
    }

    // Reads the tag to be displayed and clears it (used when navigating back to / via clicking a tag in a product details modal)
    this.readTagToDisplay = function() {
      var tempTag = tagToDisplay;
      tagToDisplay = undefined;
      return tempTag;
    }

    // Get the user's geolocation
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
          console.log("Location permission denied");
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

    // Compare weekdays in ascending order
    function compareWeekday(a,b) {
      return a.weekday - b.weekday;
    }

    // Clear the current user object
    this.clearCurrentUser = function() {
      currentUser = undefined;
    }

    // Get a new vendor object from the server
    this.retrieveUpdatedCurrentUser = function() {
      var url = this.getServerAddress() + 'vendor/';        
      return $http.get(url)
      .error(function() {
        console.log("Error retrieving vendor object!");
      }); 
    };    

    // Perform an edit of the current user
    this.updateCurrentUser = function(user) {
      var url = this.getServerAddress() + 'vendor/';        
      return $http({method: 'PATCH', url: url, data: user.vendor})
      .success(function() {
        console.log("Edited User!");
      }); 
    };

    // Update Twitter URL in server after Twitter sign in on client side
    this.updateTwitterURL = function(data) {
      var url = this.getServerAddress() + 'vendor/';        
      return $http({method: 'PATCH', url: url, data: data})
      .success(function() {
        console.log("Edited User!");
      }); 
    };    

    // Set the vendor to be displayed (used when navigating between pages)
    this.setVendorToDisplay = function(vendorID) {
      vendorToDisplay = vendorID;
    };

    // Return market details object
    this.getMarketDetails = function() {
      return marketDetails;
    }

    // Get the market details for market with id marketID
    this.getMarketToDisplay = function(marketID) {
      return $http.post(this.getServerAddress() + 'market/details/', {"id":marketID})
      .success(function(data) {
        data.address.hours.sort(compareWeekday);  
        marketDetails = data;
      })
      .error(function(data) {
        // If the client tries to request an invalid market, redirect back to /
        console.log('Error retrieving market info');
        $location.path('/');
      });
    }

    // Return vendor details object
    this.getVendorDetails = function(){
      return vendorDetails;
    };

    // Get vendor details object for vendor with id vendorToDisplay
    this.getVendorInfo = function(){
      return $http.post(this.getServerAddress() + 'vendor/details', {"id":vendorToDisplay})
      .success(function(data) {
        for(var i = 0; i < data.markets.length; i++) {
          data.markets[i].address.hours.sort(compareWeekday);
        }        
        vendorDetails = data;
      })
      .error(function(data) {
        // If the client tries to request an invalid vendor, redirect back to /        
        console.log('Error retrieving vendor info');
        $location.path('/');
      });
    };

    // Return vendor object to display
    this.getVendorInfoToDisplay = function(){
      return vendorToDisplayInfo;
    };

    // Set user profile object
    this.setProfile = function(u) {
      currentUser = u;
    };

    // Set vnedor profile cookie
    this.setProfileVendor = function(u) {
      currentUser.vendor = u;
      ipCookie('beLocalUser', currentUser, {expires: 14});
    };

    // Return user type
    this.getUserType = function() {
      return currentUser.userType;
    };

    // Return current suer
    this.getCurrentUser = function() {
      return currentUser;
    };

    // Get a list of trending/in season products from the server
    this.getTrendingProducts = function() {
      return $http.post(this.getServerAddress() + 'products/trending/', {'user_position':currentLocation})
      .success(function(data) {
        trendingProducts = data; 
      })
      .error(function(data) {
        console.log('Error retrieving trending products');
      });
    };

    // Get a list of vendors from the server
    this.getVendors = function() {
      return $http.post(this.getServerAddress() + 'vendors/', {'user_position':currentLocation})
      .success(function(data) {
        vendors = data;
      })
      .error(function(data) {
        console.log('error retrieving vendors');
      });
    };   

    // Get a list of markets from the server
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

    // Return a list of available markets
    this.getAvailableMarketList = function() {
      return availableMarkets;
    }

    // Get a list of available markets from the server
    this.getAvailableMarkets = function() {
      availableMarkets = [];
      return $http.get(this.getServerAddress() + 'vendor/markets/available/')
      .success(function(data) {
        for(var i = 0; i < data.length; i++) {
          if(data[i].address.hours.length !== 0) {
            data[i].address.hours.sort(compareWeekday);
            availableMarkets.push(data[i]);
          }
        }
      })
      .error(function(data) {
        console.log('Error retrieving markets');
      });
    };    

    // Get a list of all markets for a specific vendor
    this.getMarketLocations = function() {
      return $http.get(this.getServerAddress() + 'vendor/markets/list/')
      .error(function(data) {
        console.log('Error retrieving seller markets');
      });      
    }

    // Get a list of all seller locations for a specific vendor
    this.getSellerLocations = function() {
      return $http.get(this.getServerAddress() + 'vendor/location/list/')
      .error(function(data) {
        console.log('Error retrieving seller locations');
      }); 
    };
    
    // Get a list of all tags from the server
    this.getTags = function() {
      return $http.get(this.getServerAddress() + 'tag/list/')
      .success(function(data) { 
        taglist = data;
      })
      .error(function(data) {
        console.log('Error retrieving tags');
      });
    };

    // Get a list of all categories from the server
    this.getCategories = function() {
      return $http.get(this.getServerAddress() + 'category/list/')
      .success(function(data) {
        categorylist = data;
      })
      .error(function(data) {
        console.log('Error retrieving categories');
      });
    };
    
    // Delete or restore a location
    this.trashOrRestoreLocation = function(id, action) {
      return $http.post(this.getServerAddress() + 'vendor/location/delete/', {'id' : id, 'action' : action})
      .error(function(data) {
        console.log('Error deleting location');
      });
    };

    // Delete or restore a product
    this.trashOrRestoreProduct = function(id, action) {
      return $http.post(this.getServerAddress() + 'vendor/products/delete/', {'id' : id, 'action' : action})
      .error(function(data) {
        console.log('Error deleting product');
      });
    };    

    // Update a product's in stock/out of stock value
    this.updateStockValue = function(productId, value) {
      return $http.post(this.getServerAddress() + 'vendor/products/stock/', {'product_id' : productId, 'value' : value})
      .error(function(data) {
        console.log('Error updating product stock');
      });
    };

    // Get items from a specific vendor
    this.getSellerItems = function() {
      return $http.get(this.getServerAddress() + 'vendor/products/list/')
      .error(function(data) {
        console.log('Error retrieving seller products');
      });
    };

    // Return server address
    this.getServerAddress = function() {
      return 'http://localhost:8000/';
    };

    // Upload a product photo to the server
    this.uploadFile = function(file) {
      var fd = new FormData();
      fd.append('image', file);
      return $http.post(this.getServerAddress() + 'vendor/products/photo/add/', fd, {
        headers: {'Content-Type' : undefined},
        transformRequest: angular.identity,
      })
    };

    // Upload a profile photo to the server
    this.uploadProfileFile = function(file, selImgCoords, vendorId) {
      var fd = new FormData();
      fd.append('image', file);
      fd.append('coords', JSON.stringify(selImgCoords));
      fd.append('vendorId', vendorId)
      return $http.post(this.getServerAddress() + 'vendor/photo/add/', fd, {
        headers: {'Content-Type' : undefined},
        transformRequest: angular.identity,
      })
    };    

    // Create or edit an item
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
    
    // Get a list of products from the server that are all categorized under one category
    this.getSelectedCategoryProducts = function(category) {
      return $http.get(this.getServerAddress() + 'products/category/' + category.slug + '/')
      .success(function(data) {
        categoryProductList = data;
      })
      .error(function(data) {
        console.log('Error retrieving products of given category!');
      });
    };
    
    // Get a list of products from the server that are all tagged with one tag.
    this.getSelectedTagProducts = function(tag) {
      return $http.get(this.getServerAddress() + 'products/tag/' + tag.slug + '/')
      .success(function(data) {
        tagProductList = data; 
      })
      .error(function(data) {
        console.log('Error retrieving products of given tag!');
      });
    };

    // Return the trending/in season product list
    this.getTrendingProductsList = function() {
      return trendingProducts;
    };

    // Return the list of current vendors
    this.getVendorsList = function() {
      return vendors;
    };

    // Return the list of markets
    this.getMarketList = function() {
      return marketlist;
    };
    
    // Return the list of tags
    this.getTagList = function() { 
      return taglist;
    }
    
    // Return the list of categories
    this.getCategoryList = function() {
      return categorylist;
    }
    
    // Return the list of products categorized in the same category
    this.getSelectedCategoryProductsList = function() {
      return categoryProductList;
    }
    
    // Return the list of products tagged with the same tag
    this.getSelectedTagProductsList = function() {
      return tagProductList;
    }

    // Set the beLocal user profile from a cookie saved previously
    this.setProfileFromCookie = function() {
      this.setProfile(ipCookie('beLocalUser'));
    };

    // Create or edit a selling location
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
    
    // Join a market
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

    // Leave a market
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

    // Get a list of all vendors for the manage view
    this.getManageVendors = function() {
      return $http.get(this.getServerAddress() + "manage/vendors/list/")
        .error(function(){
            console.log('Error retrieving vendors');
        });   
    }

    // Get a list of all users for the manage view
    this.getManageUsers = function() {
      return $http.get(this.getServerAddress() + "manage/users/list/")
        .error(function(){
            console.log('Error retrieving users');
        });   
    }

    // Activate/deactivate a vendor
    this.activateVendor = function(vendor) {
      return $http.post(this.getServerAddress() + 'manage/vendors/activate/', {'id' : vendor.id})
      .error(function() {
        console.log('Error toggling vendor activation');
      })
    }
    
    // Like/unlike an item
    this.likeUnlikeItem = function(item, itemName) {
      likedUnlikedItem = item;
      if (item.is_liked) {
        // unlike the product
        return $http.delete(this.getServerAddress() + 'like/' + itemName + '/' + item.id + '/')
        .success(function(data, status, headers, config) {
          // console.log('Unliked an item! total_likes: ' + data.num_votes);
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
          // console.log('Liked an item! total_likes: '+ data.num_votes);
          likedUnlikedItem.total_likes = data.num_votes;
          likedUnlikedItem.is_liked = true;
        })
        .error(function() {
          console.log('Error liking item!');
        });
      }
    };
    
    // Return the item that has just been liked/unliked
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
    
    this.doMarketSearch = function(query) {
      return $http.get(this.getServerAddress() + "search/markets/?q=" + query)
        .error(function(){
            console.log('Error retrieving market search results!');
        });      
    };           

  });
