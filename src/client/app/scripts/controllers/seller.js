'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SellerCtrl
 * @description
 * # SellerCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SellerCtrl', function ($scope, StateService, $timeout) {
    $scope.StateService = StateService;
    $scope.opened = false;
    $scope.minDate = new Date();
    $scope.locationType = 'FAR';
    $scope.sellerLocations = [];
    $scope.emailAtLocation = StateService.getCurrentUser().email;

    $scope.resetLocationModal = function() {
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
        $scope.locationType = 'FAR';
        $scope.locationName = undefined;  
    }

    $scope.editLocation = function(location) {
        $scope.isEditingLocation = true;
        $scope.newLocationSubmitted = false;
        $scope.submitLocationButtonText = "Save Changes";

        $scope.startTime = new Date(location.start_time);
        $scope.endTime = new Date(location.end_time);
        $scope.locationDate = new Date(location.start_time);

        $scope.locationAddress = location.address.addr_line1;
        $scope.locationCity = location.address.city;
        $scope.locationProvince = location.address.state;
        $scope.locationCountry = location.address.country;
        $scope.locationType = location.address.addr_type;
        $scope.locationName = location.name;
        $scope.locationPostalCode = location.address.zipcode;
        $scope.locationId = location.id;
    }

    $scope.resetItemModal = function() {
        $scope.submitItemButtonText = "Add Item";        
    }

    $scope.fileNameChanged = function(file) {
        console.log(file);
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
                "name" : $scope.itemName,
                "description" : $scope.itemDescription,
                "photo" : $scope.newImageID
            };

            StateService.createItem(item).then(function() {
                console.log('Whee');
            });
        }
    }

    $scope.newLocationSubmit = function() {
        $scope.newLocationSubmitted = true;
            if($scope.locationForm.$valid) {
                angular.element('#locationModal').modal('hide');

                $scope.startTime.setDate($scope.locationDate.getDate());
                $scope.startTime.setMonth($scope.locationDate.getMonth());
                $scope.startTime.setFullYear($scope.locationDate.getFullYear());

                $scope.endTime.setDate($scope.locationDate.getDate());
                $scope.endTime.setMonth($scope.locationDate.getMonth());
                $scope.endTime.setFullYear($scope.locationDate.getFullYear());                    

                var address = {
                    "addr_line1" : $scope.locationAddress,
                    "city" : $scope.locationCity,
                    "state" : $scope.locationProvince,
                    "country" : $scope.locationCountry,
                    "zipcode" : $scope.locationPostalCode,
                    "latitude" : "0",
                    "longitude" : "0",
                    "addr_type" : $scope.locationType,
                };

                var sellerLocation = {
                    "id" : $scope.locationId,
                    "address" : address,
                    "start_time" : $scope.startTime,
                    "end_time" : $scope.endTime,
                    "name" : $scope.locationName,
                    'email' : $scope.emailAtLocation,
                    'phone' : $scope.phoneAtLocation,
                    'description' : $scope.locationDescription,
                };

                StateService.createSellerLocation(sellerLocation, $scope.isEditingLocation).then(function() {
                    $scope.getSellerLocations();
                });
            }
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

  });
