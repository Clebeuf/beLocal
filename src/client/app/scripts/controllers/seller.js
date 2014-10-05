'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SellerCtrl
 * @description
 * # SellerCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SellerCtrl', function ($scope, StateService) {
    $scope.StateService = StateService;
    $scope.opened = false;
    $scope.minDate = new Date();
    $scope.locationType = 'FAR';
    $scope.sellerLocations = [];

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
        $scope.submitLocationButtonText = "Edit Location";

        $scope.startTime = location.start_time;
        $scope.endTime = location.end_time;
        $scope.locationDate = location.start_time;

        $scope.locationAddress = location.address.addr_line1;
        $scope.locationCity = location.address.city;
        $scope.locationProvince = location.address.state;
        $scope.locationCountry = location.address.country;
        $scope.locationType = location.address.addr_type;
        $scope.locationName = location.name;
        $scope.locationPostalCode = location.address.zipcode;
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

    $scope.getSellerLocations = function() {
        StateService.getSellerLocations().then(function(response) {
            $scope.sellerLocations = response.data;
        })
    }

    $scope.newLocationSubmit = function() {
        $scope.newLocationSubmitted = true;
            if($scope.locationForm.$valid) {
                angular.element('#locationModal').modal('hide');

                $scope.startTime.setDate($scope.locationDate.getDate());
                $scope.startTime.setMonth($scope.locationDate.getMonth());
                $scope.startTime.setYear($scope.locationDate.getYear());

                $scope.endTime.setDate($scope.locationDate.getDate());
                $scope.endTime.setMonth($scope.locationDate.getMonth());
                $scope.endTime.setYear($scope.locationDate.getYear());                    

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
                    "address" : address,
                    "start_time" : $scope.startTime,
                    "end_time" : $scope.endTime,
                    "name" : $scope.locationName,
                };

                StateService.createSellerLocation(sellerLocation).then(function() {
                    $scope.getSellerLocations();
                });
            }
        }

    $scope.init = function() {
        $scope.getSellerLocations();
        $scope.resetLocationModal();
    }  

    $scope.init();   

  });
