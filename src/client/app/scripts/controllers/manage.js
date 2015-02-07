'use strict';

angular.module('clientApp')
  .controller('ManageCtrl', function ($scope, StateService, $location) {
    $scope.inactiveVendors = []; // list of inactive vendors
    $scope.users = []; // list of all users for beLocal
    $scope.showXSNav = true;
    $scope.submitLocationButtonText = 'Add Market';
    $scope.newLocationSubmitted = false;
    $scope.displayItemThumbnail = false;

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
