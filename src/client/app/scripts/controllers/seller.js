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
    $scope.locationDate = new Date();
    var tempDate = new Date();
    tempDate.setHours(tempDate.getHours() + 1);

    $scope.roundTimeToNearestFive = function(date) {
      var coeff = 1000 * 60 * 5;
      return new Date(Math.round(date.getTime() / coeff) * coeff);
    };

    $scope.startTime = $scope.roundTimeToNearestFive(new Date());
    $scope.endTime = $scope.roundTimeToNearestFive(tempDate);

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

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
                    "longitude" : "0"
                };

                var sellerLocation = {
                    "address" : address,
                    "start_time" : $scope.startTime,
                    "end_time" : $scope.endTime,
                    "name" : $scope.locationName,
                    "image_path" : "lol",
                };

                StateService.createSellerLocation(sellerLocation);
            }
        }
  });
