'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SellerCtrl
 * @description
 * # SellerCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SellerCtrl', function ($scope, StateService, $timeout, $q, $rootScope, $location, ipCookie) {
    $scope.StateService = StateService; // Required so that we can reference StateService in seller.html (adds it to the scope)
    $scope.opened = false; // True if the datepicker on the create location modal is open
    $scope.minDate = new Date(); // Minimum accepted date for datepicker (set to current date)
    $scope.sellerLocations = []; // List of seller locations
    $scope.emailAtLocation = StateService.getCurrentUser().email; // Email that will be used to prepopulate the create location dialog
    $scope.warningHTML = ''; // HTML string that will go into the warning (yellow) alert
    $scope.locationResults = {}; // Object for storing location search results
    $scope.locationType = 'true'; // True if one time location, false if recurring.
    $scope.facebookChecked = false; // True if the user wishes to post to Facebook
    $scope.twitterChecked = false; // True if the user wishes to post to Twitter
    $scope.sellingToday = false; // True if the user is selling today
    $scope.currentUser = {}; 
    angular.copy(StateService.getCurrentUser(), $scope.currentUser); // Used to copy the current user from StateService into this controller
    $scope.isCreatingCustomLocation = false; // True if a custom location is being created
    $scope.showInactiveAlert = true; // True if the "Your account is inactive" message should be displayed
    $scope.showXSNav = true; // True if we should be showing the XS nav bar.
    $scope.tour = undefined; // The tour object for bootstrap tour
    $scope.buttonsDisabledForTour = false;

    var geocoder = new google.maps.Geocoder(); // Create a geocoder for looking up addresses

    $rootScope.$on('$stateChangeStart', function() {
        if($scope.tour)
            $scope.tour.end();
    })

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

    // On first load, make sure we retrieve an updated current user from the database (this is mainly to ensure that if a user is
    // activated, their inactive warning will disappear)
    StateService.retrieveUpdatedCurrentUser().then(function(response){
        StateService.setProfileVendor(response.data);
        $scope.isCurrentUserActive = response.data.is_active;
    });

    // Get a list of all available markets to sell at
    StateService.getAvailableMarkets().then(function() {
        if(StateService.getAvailableMarketList().length > 0)
            $scope.newLocationMarket = StateService.getAvailableMarketList()[0].id;
    });

    // True if a user has already authenticated with Twitter. False otherwise
    $scope.isTwitterAuth = OAuth.create('twitter');
    $scope.hashtag = ' #beLocalYYJ'; // Our hashtag on Twitter!

    // Used to display weekday strings in various spots on this page.
    $scope.weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    
    // Get a list of all tags from the server.
    StateService.getTags().then(function() {
      $scope.tagList = StateService.getTagList();
    });
    
    // Get a list of all categories from the server.
    StateService.getCategories().then(function() {
      $scope.categoryList = StateService.getCategoryList();
    });

    // Hide the inactive alert
    $scope.hideInactiveAlert = function() {
        $scope.showInactiveAlert = false;
    }

    // Called to initialize the new location modal properly when the Custom Location tab is pressed
    $scope.doCustomLocation = function() {
        $scope.isCreatingCustomLocation = true;
        if($scope.isEditingLocation)
            $scope.submitLocationButtonText = 'Save Changes';
        else
            $scope.submitLocationButtonText = "Add Location";
    }

    // Used to spoof a click on the custom location tab. Used when editing a custom location
    $scope.manuallyTriggerCustomLocation = function() {
        $scope.doCustomLocation();
        $timeout(function() {
            angular.element('#customLocationTab').trigger('click');            
        });        
    }

    // Called to initialize the new location modal properly when the Market Location tab is pressed
    $scope.doMarketLocation = function() {
        $scope.isCreatingCustomLocation = false;
        $scope.submitLocationButtonText = "Join Market";
    }

    // Used to spoof a click on the market location tab. Used when editing a market location
    $scope.manuallyTriggerMarketLocation = function() {
        $scope.isCreatingCustomLocation = false;
        $scope.submitLocationButtonText = "Join Market";        
        $timeout(function() {
            angular.element('#marketLocationTab').trigger('click');            
        });        
    }

    // Sign in with Twitter!
    $scope.doTwitterSignIn = function() {
        OAuth.popup('twitter', {cache : true})
        .done(function (twitter) {
            twitter.me().done(function(me) {
                var data = {'twitter_url' : 'http://www.twitter.com/' + me.alias};
                StateService.updateTwitterURL(data).then(function(result) {
                    StateService.setProfileVendor(result.data);
                })
            });
            $scope.safeApply(function() {
                $scope.isTwitterAuth = true;
                $scope.twitterChecked = true;
            });
        });
    }

    // Compare two dates to see if they are equal. (This is necessary in order to ignore times)
    // Also use getFullYear() and not getYear(). 
    $scope.compareDates = function(date1, date2) {
        if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
            return true;
        else
            return false;
    }

    // Generate the vendor url.
    $scope.generateVendorURL = function(id) {
        var serverAddress = 'http://127.0.0.1:9000';
        return  serverAddress + '/vendor/details/' + id; 
    }

    // Generate string for Twitter. This is convoluted and gross, and I'm sorry.
    $scope.generateTwitterString = function() {
        if($scope.sellingToday) { // If the current user is selling today,
            $scope.twitterString = "We are open today. For a full list of selling locations and hours, visit " + $scope.generateVendorURL($scope.currentUser.id);
        } else { // Otherwise, say we're closed
            $scope.twitterString = "We're closed today, but make sure to check out our latest products and selling locations at " + $scope.generateVendorURL($scope.currentUser.id);
        }
    }

    // Generate Facebook string. This is even more convoluted and gross. Thankfully I already commented it when I wrote it so I don't have to again :)
    $scope.generateFacebookString = function() {
        var company_name = $scope.currentUser.vendor.company_name !== undefined ? $scope.currentUser.vendor.company_name : $scope.currentUser.name;
        $scope.facebookString = company_name + ' is selling at the following locations today:\n';

        // GENERATE LOCATIONS
        for(var i = 0; i < $scope.sellerLocations.length; i++) {
            var sl = $scope.sellerLocations[i];
            // If we're a one time location, let's see if the date is today's date.
            if(sl.date !== null) {
                var slDate = new Date(sl.date);
                slDate.setTime(slDate.getTime() + slDate.getTimezoneOffset() * 60000);

                // If so, add it to the Facebook string.
                if($scope.compareDates(new Date(), slDate)) {
                    $scope.sellingToday = true;
                    $scope.facebookString += sl.name + ' at ' + sl.address.addr_line1 + ', ' + sl.address.city + '\nFrom ' + sl.address.hours[0].from_hour + ' - ' + sl.address.hours[0].to_hour + '\n';
                }
            } else {
                // We are a recurring location. Let's see if we're open today
                for(var j = 0; j < sl.address.hours.length; j++) {
                    var today = new Date().getDay() == 0 ? 6 : new Date().getDay();
                    if(sl.address.hours[j].weekday == today) {
                        $scope.sellingToday = true;
                        $scope.facebookString += sl.name + ' at ' + sl.address.addr_line1 + ', ' + sl.address.city + '\nFrom ' + sl.address.hours[j].from_hour + ' - ' + sl.address.hours[j].to_hour + '\n';                        
                    }
                }
            }
        }

        // GENERATE ITEMS  
        $scope.facebookString += '\nSome of the items we will be selling today include the following:\n';
        for(var i = 0; i < $scope.sellerItems.length; i++) {
            var si = $scope.sellerItems[i];
            if(si.stock === "IS")
                $scope.facebookString += si.name + '\n';
        }
    }

    // Generate strings for social media (Facebook and Twitter)
    $scope.generateSocialStrings = function() {
        $scope.generateFacebookString();
        $scope.generateTwitterString();
    }

    // Publish a social media update to either Facebook or Twitter
    $scope.publishSocialUpdate = function() {
        if($scope.facebookChecked) {
      
            OAuth.popup('facebook', {cache : true, authorize: {'scope':'email, publish_actions'}})
            .done(function (facebook) {
                facebook.post({
                    url: '/me/feed',
                    data : {
                        message: $scope.facebookString
                    }
                });
            });
        } 

        // This is how we post to Twitter. If you're getting authentication errors (error code 32) it likely means you're sending back invalid
        // characters. Twitter is super needy about what characters you're allowed to send back. (! is invalid for example)
        if($scope.twitterChecked) {         
            OAuth.popup('twitter', {cache : true}).done(function(twitter) {
                twitter.post({
                    url: '/1.1/statuses/update.json' + '?status=' + escape($scope.twitterString + $scope.hashtag)
                });      
            });
        }
        angular.element('#shareModal').modal('hide');           
    }      

    // Update vendor profile
    $scope.vendorProfileUpdate = function() {
        $scope.vendorProfileUpdated = true;
        $scope.currentUser.vendor.address.addr_line1 = 'unknown'; // We should probably set these to NULL in the DB now.
        $scope.currentUser.vendor.address.zipcode = 'unknown';
        if($scope.profileForm.$valid) {
            angular.element('#profileModal').modal('hide');
            if($scope.currentUser.vendor.photo.id)
                $scope.currentUser.vendor.photo = $scope.currentUser.vendor.photo.id; // Set vendor photo to vendor.photo.id so that our serverside serializer is happy!
            StateService.updateCurrentUser($scope.currentUser).then(function(result) { // Update the vendor object on the server, and update our client side model with the result!
                StateService.setProfileVendor(result.data);
            });
        }
    }

    // Build default hours object for recurring locations. (Default right now is 8am-4pm, closed on days 6 and 7 [Saturday and Sunday])
    $scope.buildHoursObject = function() {
        var openHours = [];

        var start = new Date();
        var end = new Date();

        start.setHours(8);
        start.setMinutes(0,0);
        end.setHours(16);
        end.setMinutes(0,0);

        for(var i = 1; i < 8; i++) {
            openHours.push({
                weekday : i, 
                day : $scope.weekdays[i - 1], 
                from_hour : start, 
                to_hour: end,
                checked: i == 6 || i == 7 ? false : true
            });
        }

        return openHours;
    } 

    // Reset all fields in new location modal
    $scope.resetLocationModal = function() {
        $scope.manuallyTriggerMarketLocation(); // Go back to market tab
        $scope.addressSearchText = undefined; // Reset address search text
        $scope.newLocationSubmitted = false; // Reset has submitted flag
        $scope.isEditingLocation = false; // Reset is editing location flag

        var tempDate = new Date();
        tempDate.setHours(tempDate.getHours() + 1);
        $scope.startTime = $scope.roundTimeToNearestFive(new Date()); // Reset start time with current time
        $scope.endTime = $scope.roundTimeToNearestFive(tempDate); // Reset end time with current time + 1 hr
        $scope.locationDate = new Date(); // Reset location date to today's date
        $scope.locationHours = $scope.buildHoursObject(); // Build hours object for recurring location hours

        $scope.locationAddress = undefined; // Reset address field 
        $scope.locationCity = undefined; // Reset city field
        $scope.locationProvince = undefined; // Reset province field
        $scope.locationCountry = undefined; // Reset country field
        $scope.locationPostalCode = undefined; // Reset postal code field
        $scope.locationName = undefined; // Reset location name field
        $scope.emailAtLocation = StateService.getCurrentUser().email; // Reset email field
        $scope.phoneAtLocation = undefined; // Reset phone number field
        $scope.locationDescription = undefined;  // Reset description field
    }

    // Set the time of a new date object. This is gross, but had to be done to get around silly timezone issues that were occuring
    // by setting the time with built in functions. Javascript date/time objects are sometimes SO awful to work with.
    $scope.setTime = function(time) {
        var hour = parseInt(time.substr(0,2));
        var minute = parseInt(time.substr(3,2));
        var isPM = time.substr(5,2) === "PM"
        if (isPM) hour += 12;
        else if(!isPM && hour === 12) hour = 0;
        var date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);

        return date;
    }

    // Populate the edit location dialog fields with values coming in from the location parameter
    $scope.editLocation = function(location) {
        $scope.manuallyTriggerCustomLocation();

        if(location.date == null) {
            // If we have a recurring event, reset the one time date/time values just in case the user wants to edit their recurring
            // event and turn it into a one time event
            var hours = $scope.buildHoursObject();
            var currentHour = 0;

            var start = new Date();
            var end = new Date();

            start.setHours(8);
            start.setMinutes(0,0);
            end.setHours(16);
            end.setMinutes(0,0);        

            // This toggles the lovely day/time picker for recurring dates to match the location paramter's hours
            for(var i = 0; i < hours.length; i++) {
                if(currentHour < location.address.hours.length && hours[i].weekday === location.address.hours[currentHour].weekday) {
                    hours[i].checked = true;
                    hours[i].day = $scope.weekdays[i];
                    hours[i].from_hour = $scope.setTime(location.address.hours[currentHour].from_hour);
                    hours[i].to_hour = $scope.setTime(location.address.hours[currentHour].to_hour);
                    currentHour += 1;                    
                } else {
                    hours[i].checked = false;
                    hours[i].from_hour = start;
                    hours[i].to_hour = end;
                }
            }
            $scope.locationDate = new Date(); // This shouldn't be necessary, but it is.
            $scope.locationHours = hours;  
            $scope.locationType = 'false'; // Remember, false means recurring event. I'm sorry this had to be done, but it's used in the HTML       
        } else {
            $scope.locationType = 'true'; // Remember, false means non-recurring event.
            $scope.locationDate = location.date; // Set the date

            $scope.startTime = $scope.setTime(location.address.hours[0].from_hour); // Set the start time
            $scope.endTime = $scope.setTime(location.address.hours[0].to_hour); // Set the end time
        }

        // Set various fields in the modal.
        $scope.isEditingLocation = true;
        $scope.newLocationSubmitted = false;
        $scope.submitLocationButtonText = "Save Changes"; // This updates the submit button text.

        $scope.addressSearchText = location.address.addr_line1 + ', ' + location.address.city + ', ' + location.address.state + ' ' + location.address.zipcode + ', ' + location.address.country;

        $scope.locationAddress = location.address.addr_line1;
        $scope.locationCity = location.address.city;
        $scope.locationProvince = location.address.state;
        $scope.locationCountry = location.address.country;
        $scope.locationName = location.name;
        $scope.locationPostalCode = location.address.zipcode;
        $scope.locationId = location.id;
        $scope.emailAtLocation = location.email;
        $scope.phoneAtLocation = location.phone;
        $scope.locationDescription  = location.description;
    }

    // Reset the new item modal
    $scope.resetItemModal = function() {
        $scope.productImageError = undefined;       
        $scope.submitItemButtonText = "Add Item"; 
        $scope.isEditingItem = false;
        $scope.newItemSubmitted = false;
        $scope.itemName = undefined;
        $scope.itemDescription = undefined;
        $scope.newImageID = undefined; 
        $scope.displayItemThumbnail = false;
        $scope.newItemStock = "IS";
        $scope.itemCategory = $scope.categoryList[0].id;

        $timeout(function() {
        var e = angular.element('#item-image');
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
        })
        
        /* clear checked tags */
        var len = $scope.tagList.length;
        var counter = 0;
        for (; counter < len; counter++) {
          if ($scope.tagList[counter].checked) {
            $scope.tagList[counter].checked = undefined;
          } 
        }
    }

    // Set the item modal's fields with values coming in from the item parameter
    $scope.editItem = function(item) {

        // Magic required to reset an image picker
        var e = angular.element('#item-image');
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();

        $scope.isEditingItem = true;
        $scope.newItemSubmitted = false;
        $scope.submitItemButtonText = "Save Changes";
        $scope.displayItemThumbnail = item.photo ? true : false;

        if($scope.displayItemThumbnail)
            angular.element('#itemPreview').attr('src', item.photo.image_url).width(50).height(50);

        $scope.itemName = item.name;
        $scope.itemDescription = item.description;
        $scope.itemID = item.id;
        $scope.newImageID = item.photo ? item.photo.id : undefined;
        $scope.itemCategory = item.category ? item.category.id : undefined;
        
        /* clear checked tags */
        var len = $scope.tagList.length;
        var counter = 0;
        for (; counter < len; counter++) {
          if ($scope.tagList[counter].checked) {
            $scope.tagList[counter].checked = undefined;
          } 
        }
        
        var len1 = item.tags.length; 
        var len2 = $scope.tagList.length;
        var counter1 = 0, counter2=0;
        for (; counter1 < len1; counter1++) { 
          for(; counter2 < len2; counter2++) { 
            if ($scope.tagList[counter2].name.match(item.tags[counter1])) { 
              $scope.tagList[counter2].checked = true;
              break;
            }
          }
        } 

    }

    // Delete a location on the server, and also set the warning banner with the ability to undo this deletion if necessary
    $scope.deleteLocation = function(location) {
        $scope.deletedLocation = location;
        $scope.warningHTML = location.name + ' has been deleted! <a class="alert-link pointer" ng-click="restoreLocation(deletedLocation)">Undo?</a>';
        $scope.showWarning = true;
        StateService.trashOrRestoreLocation(location.id, 'trash').then(function() {
            $scope.getSellerLocations();            
        });  
    }

    // Delete a product on the server, and also set the warning banner with the ability to undo this deletion if necessary
    $scope.deleteProduct = function(product) {
        $scope.deletedProduct = product;
        $scope.warningHTML = product.name + ' has been deleted! <a class="alert-link pointer" ng-click="restoreProduct(deletedProduct)">Undo?</a>';
        $scope.showWarning = true;
        StateService.trashOrRestoreProduct(product.id, 'trash').then(function() {
            $scope.getSellerItems();            
        });  
    }    

    // Reset the warning (yellow) banner that can display at the top of the page
    $scope.resetWarning = function() {
        $scope.warningHTML = '';
        $scope.showWarning = false;
    }

    // Undo the deletion of the most recently deleted location
    $scope.restoreLocation = function(location) {
        $scope.resetWarning();
        StateService.trashOrRestoreLocation(location.id, 'restore').then(function() {
            $scope.getSellerLocations();
        })
    }

    // Undo the deletion of the most recently deleted product
    $scope.restoreProduct = function(product) {
        $scope.resetWarning();
        StateService.trashOrRestoreProduct(product.id, 'restore').then(function() {
            $scope.getSellerItems();
        })
    }

    // Called when an item is toggled in stock or out of stock
    $scope.stockValueChanged = function(product) {
        StateService.updateStockValue(product.id, product.stock);
    }

    // Called when an product image changes (i.e. when a new image is selected using the image picker)
    $scope.fileNameChanged = function(file) {
        $scope.productImageError = undefined;
        
        if (file && file[0]) {
            var reader = new FileReader();
            $scope.displayItemThumbnail = true;
            reader.onload = function(e) {
                angular.element('#itemPreview')
                .attr('src', e.target.result)
                .width(50)
                .height(50);             
            };
            reader.readAsDataURL(file[0]);
        }

        // Upload the new image
        StateService.uploadFile(file[0])
        .success(function(response) {
            $scope.newImageID = response.id;
        })
        .error(function(response) {
          if(response.image) {
            $scope.productImageError = response.image[0];
          }         
        });
    } 

    // Round any time to the nearest increment of five.
    $scope.roundTimeToNearestFive = function(date) {
      var coeff = 1000 * 60 * 5;
      return new Date(Math.round(date.getTime() / coeff) * coeff);
    };

    // Open the date picker. This was required due to some weird event handling that AngularUI (3rd party library whose datepicker
    // we are using) was doing.
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    // Get all items that a vendor is currently selling
    $scope.getSellerItems = function() {
        StateService.getSellerItems().then(function(response) {
            $scope.sellerItems = response.data; 
        })
    }

    // Get all locations that a vendor is currently selling at. Also reload pins/map
    $scope.getSellerLocations = function() {
        StateService.getSellerLocations().then(function(response) {
            $scope.sellerLocations = response.data;
            $rootScope.$broadcast('generateMapPins');
            $rootScope.$broadcast('forceRefreshMap');            
        })
    }

    // Comparison function used to sort weekdays in order from Monday - Sunday
    function compareWeekday(a,b) {
      return a.weekday - b.weekday;
    }

    // Get a list of all market locations that a vendor currently has. Also reload pins/map
    $scope.getMarketLocations = function() {
        StateService.getMarketLocations().then(function(response) {
            for(var i = 0; i < response.data.length; i++) {
              response.data[i].address.hours.sort(compareWeekday);
            }            
            $scope.marketLocations = response.data;
            $rootScope.$broadcast('generateMapPins');
            $rootScope.$broadcast('forceRefreshMap');            
        })
    }


    // Leave a market. I believe we should probably implement undo here at some point to remain consistent with the rest of the application
    $scope.leaveMarket = function(market) {
        var data = {
            'market_id' : market.id,
        };
        StateService.leaveMarket(data).then(function() {
            StateService.getAvailableMarkets().then(function() {
                if(StateService.getAvailableMarketList().length > 0)
                    $scope.newLocationMarket = StateService.getAvailableMarketList()[0].id;
            });
            $scope.getMarketLocations();
        })
    }        

    // Create a new item
    $scope.newItemSubmit = function() {
        $scope.newItemSubmitted = true;
        if($scope.itemForm.$valid && !$scope.productImageError) {
            angular.element('#itemModal').modal('hide');

            /* tags*/
            var tags = [];
            var len = $scope.tagList.length;
            var counter = 0;
            for (; counter < len; counter++) {
              if ($scope.tagList[counter].checked) {
                tags.push($scope.tagList[counter].name);
              }
            }
            
            var item = {
                "id" : $scope.itemID,
                "name" : $scope.itemName,
                "description" : $scope.itemDescription,
                "photo" : $scope.newImageID,
                "stock" : $scope.newItemStock,
                "category" : $scope.itemCategory,
                "tags" : tags
            };

            StateService.createItem(item, $scope.isEditingItem).then(function() {
                $scope.getSellerItems();
            });
        }
    }

    // Generate an error string when an address that has been entered is invalid.
    // Remember that these addresses are parsed using the geocoder, and thus, it's possible for a non-null address to be invalid
    // since it may be missing a field such as postal code or province. This string will tell the user exactly what's missing. The 
    // code to do this is pretty gross though. Sorry. 
    $scope.checkAddress = function() {
      var errorString = 'Please select an address with a ';
      if($scope.locationAddress === undefined)
        errorString += 'street number, ';
      if($scope.locationCity === undefined)
        errorString +=  'city, ';
      if($scope.locationProvince === undefined)
        errorString +=  'province, ';
      if($scope.locationCountry === undefined)
        errorString +=  'country, ';
      if($scope.locationPostalCode === undefined)
        errorString +=  'postal code ';

      errorString = errorString.trim(); // remove all trailing/leading whitespace

      // Shave off the last comma in the string if it ends with something like "country,"
      if(errorString.lastIndexOf(',') === errorString.length - 1) {
        errorString = errorString.substr(0, errorString.length - 1);
      }

      // If the error string remains unchanged from the beginning, return undefined since this means we have a valid address
      if(errorString === 'Please select an address with a') {
        errorString = undefined;
        return errorString;
      }

      // If we have more than one missing value, we need to add the word "and" to the string! Let's find the index of the last comma
      var andIndex = errorString.lastIndexOf(',');

      // And then let's split the string into two strings right around that last comma
      if(andIndex !== -1){
        var str1 = errorString.substr(0, andIndex + 1);
        var str2 = errorString.substr(andIndex + 1, errorString.length - 1);
        errorString = str1 + ' and' + str2; // Finally, let's join the strings back together with the word 'and' inserted.      
      }

      // This is actually a really nice way to set invalidation in a way that ensures that as soon as the user starts typing in a field,
      // the validation error will go away. (This happens since required checks to see if the string is empty, and the moment the user modifies it, it will
      // not be empty anymore so the error will dismiss)
      $scope.locationForm.addressText.$setValidity('required', false);
      return errorString;
    }

    // Submit a new location for creation/editing
    $scope.newLocationSubmit = function() {       
        $scope.newLocationSubmitted = true;
        $scope.addressErrorString = $scope.checkAddress();

        if($scope.isCreatingCustomLocation) {
            // We are creating a custom location
            if($scope.locationForm.$valid && $scope.addressErrorString === undefined) {  
                angular.element('#locationModal').modal('hide'); 
                var hours = [];

                var address = {
                    "addr_line1" : $scope.locationAddress,
                    "city" : $scope.locationCity,
                    "state" : $scope.locationProvince,
                    "country" : $scope.locationCountry,
                    "zipcode" : $scope.locationPostalCode,
                    "latitude" : $scope.latitude,
                    "longitude" : $scope.longitude
                }

                // If we are a one time location... set day/hours accordingly. Weekday of 8 means one time location.
                if($scope.locationType == 'true') {
                    hours = [{
                        "weekday" : 8,
                        "from_hour" : $scope.startTime.getHours() + ':' + $scope.startTime.getMinutes(),
                        "to_hour" : $scope.endTime.getHours() + ':' + $scope.endTime.getMinutes()
                    }];
                } else {
                    // We are a recurring location... set hours accordingly
                    var hours = [];
                    $scope.locationDate = null;
                    for(var i = 0; i < $scope.locationHours.length; i++) {
                        if($scope.locationHours[i].checked) {
                            hours.push({
                                "weekday" : $scope.locationHours[i].weekday,
                                "from_hour" : $scope.locationHours[i].from_hour.getHours() + ':' + $scope.locationHours[i].from_hour.getMinutes(),
                                "to_hour" : $scope.locationHours[i].to_hour.getHours() + ':' + $scope.locationHours[i].to_hour.getMinutes()
                            });
                        }
                    }             
                }

                address.hours = hours;             

                // Create the selling location object to send to the server
                var sellerLocation = {
                    "id" : $scope.locationId,
                    "date" : $scope.locationDate instanceof Date ? $scope.locationDate.getFullYear() + '-' + ($scope.locationDate.getMonth() + 1) + '-' + $scope.locationDate.getDate() : $scope.locationDate,
                    "address" : address,
                    "name" : $scope.locationName,
                    'email' : $scope.emailAtLocation,
                    'phone' : $scope.phoneAtLocation,
                    'description' : $scope.locationDescription,
                };

                // Create/edit the selling location. Note here that whether we're creating or editing depends on $scope.isEditingLocation
                StateService.createSellerLocation(sellerLocation, $scope.isEditingLocation).then(function() {
                    $scope.getSellerLocations();
                    $scope.getSellerItems();
                });
            }
        } else {
            // We are trying to join a market.
            angular.element('#locationModal').modal('hide');             
            var data = {
                'market_id' : $scope.newLocationMarket.id,
            };

            StateService.joinMarket(data).then(function() {
                StateService.getAvailableMarkets().then(function() {
                    if(StateService.getAvailableMarketList().length > 0)
                        $scope.newLocationMarket = StateService.getAvailableMarketList()[0];
                });                
                $scope.getMarketLocations();
            })
        }
    }

    // Format the user entered address string in a way that the geocoder can parse.
    $scope.formatAddress = function(address) {
      return address.replace(' ', '+');
    }      

    // Get a location asynchroneously from the geocoder
    $scope.getLocation = function(value) {
        var d = $q.defer();
          if(value !== undefined) {
            geocoder.geocode( { 'address': $scope.formatAddress(value)}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                $timeout(function() {
                    d.resolve(results)              
                });
              }
            });
        }

        return d.promise;
    }

    // More dirty code to ensure that we parse the correct results from the geocoder in each case.
    // This SUCKS because Google chooses to return addresses in one of the most useless formats I've ever seen.
    // As a result, there's no way to parse them properly other than to step through each and every entry associated
    // with them and see if it's the one we want. More on this here: https://developers.google.com/maps/documentation/geocoding/#JSON
    $scope.parseGeocoderResult = function(result) {
        var location = {}
        for(var i = 0; i < result.address_components.length; i++) {
            var component = result.address_components[i];

            if($scope.compareGeocoderType(component.types, 'street_number')) 
                location.street_number = component.short_name;
            else if($scope.compareGeocoderType(component.types, 'route'))
                location.route = component.long_name;
            else if($scope.compareGeocoderType(component.types, 'sublocality'))
                location.city = component.long_name;      
            else if($scope.compareGeocoderType(component.types, 'locality'))
                location.city = component.long_name;
            else if($scope.compareGeocoderType(component.types, 'administrative_area_level_1'))
                location.state = component.short_name;
            else if($scope.compareGeocoderType(component.types, 'country'))
                location.country = component.long_name;            
            else if($scope.compareGeocoderType(component.types, 'postal_code'))
                location.postal_code = component.long_name;              
        }
        return location;
    }

    // Geocoder results can have nested component types and order is not guranteed. As a result, we have to step through ALL components
    // to see if the result has the ones we want/need.
    $scope.compareGeocoderType = function(types, compareTo) {
        for(var i = 0; i < types.length; i++) {
            if(types[i] === compareTo) {
                return true;
            }
        }
        return false;
    }

    // Called when a user selects a value from the geocoder dropdown
    $scope.makeSelection = function(item) {
        var parsedLocation = $scope.parseGeocoderResult(item);

        $scope.locationAddress = parsedLocation.street_number + ' ' + parsedLocation.route;
        $scope.locationCity = parsedLocation.city;
        $scope.locationProvince = parsedLocation.state;
        $scope.locationCountry = parsedLocation.country;
        $scope.locationPostalCode = parsedLocation.postal_code;
        $scope.latitude = item.geometry.location.lat();
        $scope.longitude = item.geometry.location.lng();   
    }

    // Make pins on the map bounce!
    $scope.highlightPins = function(object) {
        if(object && object.marker)          
            object.marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    // Stop the bouncing!
    $scope.unHighlightPins = function(object) {
        if(object && object.marker)          
            object.marker.setAnimation(null);
    };

    $scope.launchProfileImageModal = function(){
        if (!$scope.buttonsDisabledForTour){
    	   angular.element('#profileImageModal').modal('show');
        }
    }

    $scope.resetProfileImageModal = function(){
    	$scope.profileImageError = undefined;
    	$scope.profileImage = undefined;
    	$scope.showImageSelectButton = true;
    	$scope.showImageCroppingText = false;
    	$scope.disableProfileImageSubmit = true;
    }

    $scope.resetProfileImageModal();

   	angular.element('#profileImageModal').on('hide.bs.modal', function(){
   		$scope.resetProfileImageModal();
   	})

    $scope.handleProfileImageFileSelect=function(file) {
        if(file && file[0]) {
        	if(file[0].size > 3000000){
        		
        		$scope.safeApply(function($scope){
        			$scope.profileImageError = 'The selected file is too big. Please select a file less than 3 MB.';
        		})
        	} else {
        				$scope.profileImageError = null;
        		    	$scope.showImageSelectButton = false;
    					$scope.showImageCroppingText = true;
	            var reader = new FileReader();
	            reader.onload = function (evt) {
	                $scope.safeApply(function($scope){
	                    $scope.profileImage = evt.target.result;
	                    $scope.disableProfileImageSubmit = false;
	                });
	            };
	            reader.readAsDataURL(file[0]);
	        }
            //cloning and replacing the file input element with itself in order to clear it
            //this is because the onchange event doesn't get triggered if the user selects the
            //same file as last time.
            angular.element('#profile-image').replaceWith(angular.element('#profile-image').clone(true));
	            //angular.element('#profileImageModal').modal('show');
        }
    };

     $scope.selected = function(x) {
    	$scope.profileImageCoords = [x.x, x.y, x.x2, x.y2];
  	};

  	$scope.triggerImageSelect = function () {
		  $timeout(function() {
		    angular.element('#profile-image').trigger('click');
		  }, 100);
		};

	$scope.uploadProfileImage = function() {
		//change the Done button to a loader to prevent clicks while uploading
		angular.element('#uploadProfileImage').button('loading');
		if($scope.profileImage){
            StateService.uploadProfileFile($scope.profileImage, $scope.profileImageCoords)
            .success(function(response) {
              //   angular.element('#profileImage').css({
              //   	'background-image': 'url(' + response.image_url +')'
            		// });
                StateService.getCurrentUser().vendor.photo.image_url = response.image_url;
                StateService.getCurrentUser().vendor.photo.id = response.id;
                $scope.currentUser = StateService.getCurrentUser();
                angular.element('#profileImageModal').modal('hide');
                $scope.resetProfileImageModal();
                angular.element('#uploadProfileImage').button('reset');
            })
            .error(function(response){
                angular.element('#uploadProfileImage').button('reset');
                $scope.profileImageError = response;
            });
         }
	}

    // Initialize the seller page.
    $scope.init = function() {
        $scope.getSellerLocations();
        $scope.getSellerItems();
        $scope.getMarketLocations();
        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        }, 1000)

        $scope.resetLocationModal();
    }  

    $scope.init();


    // ---- BOOTSTRAP TOUR --------

    // Instance the tour
    $scope.tour = new Tour({
        container: 'body',
        keyboard: true,
        backdrop: true,
        orphan: true,
        reflex: false,        
        debug: false, 
        onShown: function(tour) {
            var step = tour._options.steps[tour._current];
            angular.element(step.element).attr('disabled', true);
            $scope.buttonsDisabledForTour = true;
        },
        onHidden: function(tour) {
            var step = tour._options.steps[tour._current];
            angular.element (step.element).removeAttr('disabled');
            $scope.buttonsDisabledForTour = false;
        },               
        steps: [
          {
            element: "",
            title: "<center><b>Welcome to beLocal Victoria</b></center>",
            content: "Thank you for registering as a local farmer or foodmaker. Here's a quick tutorial to get you on your way.",
          },
          {
            element: "#imageOverlay",
            title: "<center><b>Updating your Profile Image</b></center>",
            content: "Click here to upload a new profile image. Once uploaded, you will be able to crop your image so that it fits perfectly in your company's profile.",
            placement: "bottom"
          },
          {
            element: "#editProfileBtn",
            title: "<center><b>Updating your Profile</b></center>",
            content: "Click the edit profile button to update your company name, address, and contact information.  Also link to your Facebook page, personal webpage, and add a description about your company.",
            placement: "bottom"
          },
          {
            element: "#socialMediaBtn",
            title: "<center><b>Post to Social Media</b></center>",
            content: "Post directly to your Twitter and Facebook accounts by either writing your own custom status or by using our recommend updates.",
            placement: "bottom"
          },
          {
            element: "#addLocationBtn",
            title: "<center><b>Add a Selling Location</b></center>",
            content: "Let customers know where you are selling.  Simply select from a list of currently running markets or create your own custom selling location.",
            placement: "bottom"
          },
          {
            element: "#markets",
            title: "<center><b>Your Market Locations</b></center>",
            content: "Once you select a market as one of your selling locations, you will see it listed here.",
            placement: "top"
          },
          {
            element: "#customLocations",
            title: "<center><b>Your Custom Locations</b></center>",
            content: "Likewise, any custom selling locations you create will be listed here.",
            placement: "top"
          },
          {
            element: "#addItem",
            title: "<center><b>Add Some Products</b></center>",
            content: "Click here to add items that you will be selling. You can upload a picture, add a short description, and select the category of your product.",
            placement: "top"
          },
          {
            element: "#viewItems",
            title: "<center><b>Your Inventory</b></center>",
            content: "Once you've added some items that you are selling you will see them displayed here.  You can easily set each of your products to either in stock (this will allow customers to see your product) or out of stock (this will keep the product hidden from customers).",
            placement: "top"
          },
          {
            element: "",
            title: "<center><b>Request Account Activation</b></center>",
            content: "Once you're happy with your profile, don't forget to send us an email at <a href='mailto:" + "belocalvictoria" + "@gmail.com" + "'>" + "belocalvictoria" + "@gmail.com" + "</a> to request activation. Doing so will allow other users to see your profile, selling locations, and products you have for sale.",
            placement: "bottom"
          },
          {
            element: "",
            title: "<center><b>Take the Tour Again</b></center>",
            content: "<center>If at any time you would like to take this tutorial again, select Vendor Tutorial from the drop down menu in the navigation bar. <hr><center><b> If you have any questions or comments please don't hesitate to contact us at </b><a href='mailto:" + "belocalvictoria" + "@gmail.com" + "'>" + "belocalvictoria" + "@gmail.com" + "</a></center>",
            placement: "bottom"
          }  

        ]
    });

    // initalize the tour
    $scope.tour.init();

    //if the tour was requested from a different page
    var url = document.location.toString();
    if (url.split('#')[2]) {
        console.log(url.split('#')[2]);

        if(url.split('#')[2] === 'tour'){
            $scope.tour.restart(true);
            $location.hash('');
        }
    };

    //if first time log in, start the tour & set a cookie
    if (!ipCookie('beLocalTutorial')) {
        console.log('first time on tour'); 
        $scope.tour.restart(true);
        ipCookie('beLocalTutorial', true, {expires: 365});
    }else {
        console.log('already taken tour');
    };

    // ---- END OF BOOTSTRAP TOUR --------

  })
  .directive('htmlComp', function($compile, $parse) {
      // Directive for compiling HTML strings. This is necessary so that we can use AngularJS bindings in the warning banner and have them actually work.
      // $compile is super cool! If you haven't read about it: https://docs.angularjs.org/api/ng/service/$compile
      return {
        restrict: 'E',
        link: function(scope, element, attr) {
          scope.$watch(attr.content, function() {
            element.html($parse(attr.content)(scope));
            $compile(element.contents())(scope);
          }, true);
        }
      }
  })
  .directive('phone', function() {
    // This is a directive to ensure that an input field contains an phone value.
    var PHONE_REGEX = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;    
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          if (viewValue === "" || PHONE_REGEX.test(viewValue)) {
            // it is valid
            ctrl.$setValidity('phone', true);
            return viewValue;
          } else {
            // it is invalid, return undefined (no model update)
            ctrl.$setValidity('phone', false);
            return undefined;
          }
        });
      }
    };
  });


