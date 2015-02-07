'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService, $location, $q, $timeout) {
    $scope.inactiveVendors = []; // list of inactive vendors
    $scope.users = []; // list of all users for beLocal
    $scope.showXSNav = true;
    $scope.submitLocationButtonText = 'Add Market';
    $scope.newLocationSubmitted = false;
    $scope.displayItemThumbnail = false;
    $scope.repeatUntil = 'never'; // Default is that recurring events will repeat indefinitely
    $scope.recurrenceFrequency = 2;
    $scope.recurrenceInterval = 1;
    $scope.compareDate = new Date();
    $scope.minDate = new Date(); // Minimum accepted date for datepicker (set to current date)

    var geocoder = new google.maps.Geocoder(); // Create a geocoder for looking up addresses

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

    $scope.range = function(n) {
        return new Array(n);
    };      

    // Open the date picker. This was required due to some weird event handling that AngularUI (3rd party library whose datepicker
    // we are using) was doing.
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.openStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.startOpened = true;
    }; 

    $scope.openEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.endOpened = true;
    };    

    // Reset all fields in new location modal
    $scope.resetLocationModal = function() {
        $scope.addressSearchText = undefined; // Reset address search text
        $scope.newLocationSubmitted = false; // Reset has submitted flag
        $scope.isEditingLocation = false; // Reset is editing location flag
        $scope.recurrenceFrequency = 2; // Reset recurrence value
        $scope.recurrenceInterval = 1; // Reset frequency value

        var tempDate = new Date();
        tempDate.setHours(tempDate.getHours() + 1);
        $scope.recurrenceStartDate = new Date(); // Reset recurrence start date to today's date        
        $scope.recurrenceEndDate = new Date(); // Reset recurrence start date to today's date          
        $scope.locationHours = $scope.buildHoursObject(); // Build hours object for recurring location hours

        $scope.locationAddress = undefined; // Reset address field 
        $scope.locationCity = undefined; // Reset city field
        $scope.locationProvince = undefined; // Reset province field
        $scope.locationCountry = undefined; // Reset country field
        $scope.locationPostalCode = undefined; // Reset postal code field
        $scope.locationName = undefined; // Reset location name field
        $scope.website = undefined; // Reset website
        $scope.locationDescription = undefined;  // Reset description field
    }    

    $scope.getMonday = function(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }

    $scope.initDate = function(d) {
        var date = new Date(d)
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
        return date;        
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

    // Get a list of vendors and users from the server
    $scope.initialize = function() {
        StateService.getManageVendors().then(function(response) {
            $scope.inactiveVendors = response.data;
        });

        StateService.getManageUsers().then(function(response) {
            $scope.users = response.data;
        }); 

        StateService.getMarkets().then(function() {
            $scope.marketList = StateService.getMarketList();
        });
        $scope.locationHours = $scope.buildHoursObject(); // Build hours object for recurring location hours          
    }

    // Go to vendor details page for vendor with specified id
    $scope.displayVendor = function (id) {         
        $location.path('vendor/details/'+ id);
    };

    // Delete a user. The password is $gituvicsoup. Don't ask. 
    $scope.deleteUser = function(user) {
        var response = prompt('Say the magic word to make ' + user.first_name + ' ' + user.last_name + ' go boom!');
        if(response === '$gituvicsoup') {
            StateService.deleteUser(user.id).then(function() {
                $scope.initialize();
            });
        }
    } 

    // Comparison function used to sort weekdays in order from Monday - Sunday
    function compareWeekday(a,b) {
      return a.weekday - b.weekday;
    }     

    // Activate or deactivate a vendor
    $scope.activateVendor = function(vendor) {
        StateService.activateVendor(vendor).then(function() {
            StateService.getManageVendors().then(function(response) {
                $scope.inactiveVendors = response.data;
            });             
        });
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

    // Submit a new location for creation/editing
    $scope.newLocationSubmit = function() {       
        $scope.newLocationSubmitted = true;

        
        // We are creating a custom location
        if($scope.locationForm.$valid && $scope.addressErrorString === undefined) {  
            angular.element('#marketModal').modal('hide'); 
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

            // We are a recurring location... set hours accordingly
            var hours = [];                    

            $scope.locationDate = null;
            for(var i = 0; i < $scope.locationHours.length; i++) {
                if($scope.locationHours[i].checked) {
                    hours.push({
                        "weekday" : $scope.locationHours[i].weekday,
                        "from_hour" : $scope.locationHours[i].from_hour.getHours() + ':' + $scope.locationHours[i].from_hour.getMinutes(),
                        "to_hour" : $scope.locationHours[i].to_hour.getHours() + ':' + $scope.locationHours[i].to_hour.getMinutes(),
                        "recurrences" : recurrence,
                    });
                }
            }             

            address.hours = hours;             

            // Create the selling location object to send to the server
            var market = {
                "id" : $scope.locationId,
                "address" : address,
                "name" : $scope.locationName,
                'description' : $scope.locationDescription,
                'real_start' : $scope.recurrenceStartDate instanceof Date ? $scope.recurrenceStartDate.getFullYear() + '-' + ('0' + ($scope.recurrenceStartDate.getMonth() + 1)).slice(-2) + '-' + ('0' + $scope.recurrenceStartDate.getDate()).slice(-2) : $scope.recurrenceStartDate,
                "webpage" : $scope.website,
            };


            var mondayOfWeek = $scope.getMonday($scope.recurrenceStartDate);

            var rule = {
                'freq' : $scope.recurrenceFrequency,
                'interval' : $scope.recurrenceInterval,
                'until' : $scope.repeatUntil !== 'never' ? $scope.recurrenceEndDate instanceof Date ? $scope.recurrenceEndDate.getFullYear() + '-' + ($scope.recurrenceEndDate.getMonth() + 1) + '-' + $scope.recurrenceEndDate.getDate() : $scope.recurrenceEndDate : null,
            };

            var recurrence = {
                'dtstart' : mondayOfWeek instanceof Date ? mondayOfWeek.getFullYear() + '-' + ('0' + (mondayOfWeek.getMonth() + 1)).slice(-2) + '-' + ('0' + mondayOfWeek.getDate()).slice(-2) : mondayOfWeek,
                'rule' : rule,
            };

            market.recurrences = recurrence;

            console.log(market);                  

            // // Create/edit the selling location. Note here that whether we're creating or editing depends on $scope.isEditingLocation
            // StateService.createSellerLocation(market, $scope.isEditingLocation).then(function() {
            //     $scope.getSellerLocations();
            //     $scope.getSellerItems();
            // });
        }
    } 

    // Called when an market image changes (i.e. when a new image is selected using the image picker)
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
        StateService.uploadMarketFile(file[0])
        .success(function(response) {
            $scope.newImageID = response.id;
        })
        .error(function(response) {
          if(response.image) {
            $scope.marketImageError = response.image[0];
          }         
        });
    }        

    // Initialize the manage view on first load
    $scope.initialize();
    
  });
