'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SellerCtrl
 * @description
 * # SellerCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SellerCtrl', function ($scope, StateService, $timeout, $q) {
    $scope.StateService = StateService;
    $scope.opened = false;
    $scope.minDate = new Date();
    $scope.sellerLocations = [];
    $scope.emailAtLocation = StateService.getCurrentUser().email;
    $scope.warningHTML = '';
    $scope.locationResults = {};
    $scope.locationType = 'true';

    var geocoder = new google.maps.Geocoder();    

    $scope.resetLocationModal = function() {
        $scope.addressSearchText = undefined;
        $scope.newLocationSubmitted = false;
        $scope.isEditingLocation = false;       
        $scope.submitLocationButtonText = "Add Location";

        var tempDate = new Date();
        tempDate.setHours(tempDate.getHours() + 1);
        $scope.startTime = $scope.roundTimeToNearestFive(new Date());
        $scope.endTime = $scope.roundTimeToNearestFive(tempDate);
        $scope.locationDate = new Date();        

        $scope.locationAddress = undefined;
        $scope.locationCity = undefined;
        $scope.locationProvince = undefined;
        $scope.locationCountry = undefined;
        $scope.locationPostalCode = undefined;
        $scope.locationName = undefined;
        $scope.emailAtLocation = StateService.getCurrentUser().email;
        $scope.phoneAtLocation = undefined;
        $scope.locationDescription = undefined;  
    }

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

    $scope.editLocation = function(location) {
        console.log(location);
        $scope.isEditingLocation = true;
        $scope.newLocationSubmitted = false;
        $scope.submitLocationButtonText = "Save Changes";

        var date = new Date(location.date);
        $scope.locationDate = date;

        console.log($scope.locationDate);

        $scope.startTime = $scope.setTime(location.address.hours[0].from_hour);
        $scope.endTime = $scope.setTime(location.address.hours[0].to_hour);

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

    $scope.resetItemModal = function() {
        $scope.submitItemButtonText = "Add Item"; 
        $scope.isEditingItem = false;
        $scope.newItemSubmitted = false;
        $scope.itemName = undefined;
        $scope.itemDescription = undefined;
        $scope.newImageID = undefined; 
        $scope.displayItemThumbnail = false;
        $scope.newItemStock = "IS";

        var e = angular.element('#item-image');
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
    }

    $scope.editItem = function(item) {

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

    }

    $scope.deleteLocation = function(location) {
        $scope.deletedLocation = location;
        $scope.warningHTML = location.name + ' has been deleted! <a class="alert-link pointer" ng-click="restoreLocation(deletedLocation)">Undo?</a>';
        $scope.showWarning = true;
        StateService.trashOrRestoreLocation(location.id, 'trash').then(function() {
            $scope.getSellerLocations();            
        });  
    }

    $scope.deleteProduct = function(product) {
        $scope.deletedProduct = product;
        $scope.warningHTML = product.name + ' has been deleted! <a class="alert-link pointer" ng-click="restoreProduct(deletedProduct)">Undo?</a>';
        $scope.showWarning = true;
        StateService.trashOrRestoreProduct(product.id, 'trash').then(function() {
            $scope.getSellerItems();            
        });  
    }    

    $scope.resetWarning = function() {
        $scope.warningHTML = '';
        $scope.showWarning = false;
    }

    $scope.restoreLocation = function(location) {
        $scope.resetWarning();
        StateService.trashOrRestoreLocation(location.id, 'restore').then(function() {
            $scope.getSellerLocations();
        })
    }

    $scope.restoreProduct = function(product) {
        $scope.resetWarning();
        StateService.trashOrRestoreProduct(product.id, 'restore').then(function() {
            $scope.getSellerItems();
        })
    }

    $scope.stockValueChanged = function(product) {
        StateService.updateStockValue(product.id, product.stock);
    }

    $scope.fileNameChanged = function(file) {

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

        StateService.uploadFile(file[0])
        .success(function(response) {
            $scope.newImageID = response.id;
        });
    }

    $scope.roundTimeToNearestFive = function(date) {
      var coeff = 1000 * 60 * 5;
      return new Date(Math.round(date.getTime() / coeff) * coeff);
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.getSellerItems = function() {
        StateService.getSellerItems().then(function(response) {
            $scope.sellerItems = response.data;
        })
    }

    $scope.getSellerLocations = function() {
        StateService.getSellerLocations().then(function(response) {
            $scope.sellerLocations = response.data;
        })
    }

    $scope.newItemSubmit = function() {
        $scope.newItemSubmitted = true;
        if($scope.itemForm.$valid) {
            angular.element('#itemModal').modal('hide');

            var item = {
                "id" : $scope.itemID,
                "name" : $scope.itemName,
                "description" : $scope.itemDescription,
                "photo" : $scope.newImageID,
                "stock" : $scope.newItemStock
            };

            StateService.createItem(item, $scope.isEditingItem).then(function() {
                $scope.getSellerItems();
            });
        }
    }

    $scope.newLocationSubmit = function() {
        $scope.newLocationSubmitted = true;
        if($scope.locationForm.$valid) {
            angular.element('#locationModal').modal('hide');
            var hours = {};                  

            var address = {
                "addr_line1" : $scope.locationAddress,
                "city" : $scope.locationCity,
                "state" : $scope.locationProvince,
                "country" : $scope.locationCountry,
                "zipcode" : $scope.locationPostalCode,
                "latitude" : $scope.latitude,
                "longitude" : $scope.longitude
            };

            // If we are a one time location...
            if($scope.locationType == 'true') {
                hours = [{
                    "weekday" : 8,
                    "from_hour" : $scope.startTime.getHours() + ':' + $scope.startTime.getMinutes(),
                    "to_hour" : $scope.endTime.getHours() + ':' + $scope.endTime.getMinutes()
                }];
            }

            address.hours = hours;

            var sellerLocation = {
                "id" : $scope.locationId,
                "date" : $scope.locationDate.getFullYear() + '-' + ($scope.locationDate.getMonth() + 1) + '-' + $scope.locationDate.getDate(),
                "address" : address,
                "name" : $scope.locationName,
                'email' : $scope.emailAtLocation,
                'phone' : $scope.phoneAtLocation,
                'description' : $scope.locationDescription,
            };

            StateService.createSellerLocation(sellerLocation, $scope.isEditingLocation).then(function() {
                $scope.getSellerLocations();
                $scope.getSellerItems();
            });
        }
    }

    $scope.formatAddress = function(address) {
      return address.replace(' ', '+');
    }      

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

    $scope.makeSelection = function(item) {
        $scope.selectedLocation = item.address_components;
        $scope.locationAddress = $scope.selectedLocation[0].short_name + ' ' + $scope.selectedLocation[1].long_name;
        $scope.locationCity = $scope.selectedLocation[3].long_name;
        $scope.locationProvince = $scope.selectedLocation[5].short_name;
        $scope.locationCountry = $scope.selectedLocation[6].long_name;
        $scope.locationPostalCode = $scope.selectedLocation[7].long_name;
        $scope.latitude = item.geometry.location.k;
        $scope.longitude = item.geometry.location.B;   
    }

    $scope.init = function() {
        $scope.getSellerLocations();
        $scope.getSellerItems();
        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        }, 1000)

        $scope.resetLocationModal();3
    }  

    $scope.init();   

  })
  .directive('htmlComp', function($compile, $parse) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      scope.$watch(attr.content, function() {
        element.html($parse(attr.content)(scope));
        $compile(element.contents())(scope);
      }, true);
    }
  }
  });
