'use strict';

angular.module('clientApp')
  .directive('beLocalMap', function ($timeout, $compile, StateService, $location) {
    return {
      scope: {
        lat: '=', // latitude of the map
        long: '=', // longitude of the map
        zoom: '=', // zoom level of the map
        vendors: '=', // list of objects to display on map
        markets: '=', // list of markets to display on map
        locations: '=', // list of selling locations to display on map
      },  
      link: function ($scope, elem, attrs) {

        var style = [{"featureType":"landscape","stylers":[{"hue":"#FFA800"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#53FF00"},{"saturation":-73},{"lightness":40},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FBFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#00FFFD"},{"saturation":0},{"lightness":30},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00BFFF"},{"saturation":6},{"lightness":8},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#679714"},{"saturation":33.4},{"lightness":-25.4},{"gamma":1}]}]

        var mapOptions,
          latitude = $scope.lat,
          longitude = $scope.long,
          zoom = $scope.zoom,
          markers = [],
          bubbles = [],
          map;

        latitude = latitude && parseFloat(latitude, 10) || 48.4630959;
        longitude = longitude && parseFloat(longitude, 10) || -123.3121053;
        zoom = zoom && parseInt(zoom) || 10;

        mapOptions = {
          panControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoom: zoom,
          center: new google.maps.LatLng(latitude, longitude),
          styles: style,
        };

        map = new google.maps.Map(elem[0], mapOptions);

        google.maps.event.addListener(map, 'click', function() {
          $scope.closeAllBubbles();
        });        

        $scope.$on('generateMapPins', function() {
          $timeout(function() {
            $scope.clearMarkers();            
            // Initialize map
            if($scope.vendors != undefined) {
              for(var i = 0; i < $scope.vendors.length; i++) {
                  var vendor = $scope.vendors[i];
                  vendor.markers = [];

                  if(vendor.selling_locations) {
                      for(var j = 0; j < vendor.selling_locations.length; j++) {
                          var sellingLocation = vendor.selling_locations[j];

                          var infoTemplate = $scope.getVendorInfoTemplate(sellingLocation, vendor);
                          var center = new google.maps.LatLng(sellingLocation.address.latitude, sellingLocation.address.longitude);
                          vendor.markers.push($scope.createMarker(center, infoTemplate));
                      }
                  }
              }
            } 

            if($scope.markets != undefined) {
              for(var i = 0; i < $scope.markets.length; i++) {
                  var market = $scope.markets[i];

                  var infoTemplate = $scope.getMarketInfoTemplate(market);
                  var center = new google.maps.LatLng(market.address.latitude, market.address.longitude);
                  market.marker = $scope.createMarker(center, infoTemplate);
              }
            }

            if($scope.locations != undefined) {
              for(var i = 0; i < $scope.locations.length; i++) {
                  var sellingLocation = $scope.locations[i];

                  var infoTemplate = $scope.getLocationInfoTemplate(sellingLocation);
                  var center = new google.maps.LatLng(sellingLocation.address.latitude, sellingLocation.address.longitude);
                  sellingLocation.marker = $scope.createMarker(center, infoTemplate);
              }              
            }

          });
        });

        // Completely clear all markers on the map
        $scope.clearMarkers = function() {
          for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
          markers = [];
          bubbles = [];
        };

        // Close all bubbles on the map
        $scope.closeAllBubbles = function() {
          for(var i = 0; i < bubbles.length; i++) {
            bubbles[i].close(map, markers[i]);
          }
        }

        // Close all bubbles except for the one that's already open
        $scope.closeAllBubblesExcept = function() {
          for(var i = 0; i < bubbles.length; i++) {
            if(!bubbles[i].opened) {
              bubbles[i].close(map, markers[i]);              
            }
          }
        }        

        $scope.createMarker = function(center, infoTemplate) {
            var marker = new google.maps.Marker({
              position: center,
              map: map
            });
            markers.push(marker);

            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(infoTemplate); 
            var compiled = ($compile(infowindow.content)($scope));
            infowindow.setContent(compiled[0]); 

            google.maps.event.addListener(marker, 'click', function() {
              $scope.closeAllBubblesExcept();
              infowindow.open(map, marker); 
            }); 

            bubbles.push(infowindow);

            return marker;                               
        }

        $scope.getMarketInfoTemplate = function(market) {
            var infoTemplate = '' + 
            '<div class="info-window-content">' + 
            '<div>' +
            '<h5 class="no-bottom-margin">' + 
            '<a class="vendor-card-name pointer" ng-click="displayMarket(' + market.id + ')">' +
             market.name + 
             '</a>' + 
             '</h5>' +
             '<p class="plain-text info-window-text">' +   
             '<a href="http://maps.google.com/?q=' +
             market.address.latitude + ',' + market.address.longitude + '" target="_blank" >' +
             '<span class="info-window-text">' + 
             market.address.addr_line1 + ', ' + market.address.state + ', ' + market.address.country +  
             '</span>' +  
             '</a>' +
             '</p><br>' +
             '</div>' + 
            '</div>';

            return infoTemplate;           
        }

        $scope.getVendorInfoTemplate = function(object, parent) {
            var infoTemplate = '' + 
            '<div class="info-window-content">' + 
            '<div>' +
            '<h5 class="no-bottom-margin">' + 
            '<a class="vendor-card-name pointer" ng-click="displayVendor(' + parent.id + ')">' +
             parent.company_name + 
             '</a>' + 
             '</h5>' +
             '<p class="plain-text info-window-text">' + 
             '<span style="color: black !important">' + 
             object.name + '<br>' +
             '</span>' +  
             '<span class="info-window-text">' + 
             object.address.addr_line1 + ', ' + object.address.state + ', ' + object.address.country +  
             '</span>' +  
             '</p><br>' +
             '</div>' + 
            '</div>';

            return infoTemplate;           
        }

        $scope.getLocationInfoTemplate = function(object) {
            var infoTemplate = '' + 
            '<div class="info-window-content">' + 
            '<div>' +
            '<h5 class="no-bottom-margin">' + 
            '<a class="vendor-card-name pointer">' +
             object.name  + 
             '</a>' + 
             '</h5>' +
             '<p class="plain-text info-window-text">' + 
             '<span class="info-window-text">' + 
             object.address.addr_line1 + ', ' + object.address.state + ', ' + object.address.country +  
             '</span>' +  
             '</p><br>' +
             '</div>' + 
            '</div>';

            return infoTemplate;           
        }        

        $scope.$on('forceRefreshMap', function() {
            $timeout(function() {
                google.maps.event.trigger(map, 'resize');                
                var bounds = new google.maps.LatLngBounds();
                for(var i=0;i<markers.length;i++) {
                 bounds.extend(markers[i].getPosition());
                }
                map.fitBounds(bounds);                
            });
        });

        $scope.displayVendor = function (id) {
          var user = StateService.getCurrentUser();
          if(user && user.userType === 'VEN' && user.vendor.id === id) {
            $location.path('/vendor');
          } else {            
            $location.path('vendor/details/'+ id);
          }
        };

        $scope.displayMarket = function (id) {
          $location.path('market/details/'+id).replace();
        };        

      }     
    };
  });
