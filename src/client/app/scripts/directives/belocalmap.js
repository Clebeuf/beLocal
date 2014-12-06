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

        // Style the map
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

        // Set map options
        mapOptions = {
          panControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoom: zoom,
          center: new google.maps.LatLng(latitude, longitude),
          styles: style,
        };

        // Create new map
        map = new google.maps.Map(elem[0], mapOptions);

        // Add a listener to the map so that when it's clicked, we close all information bubbles that are currently open
        google.maps.event.addListener(map, 'click', function() {
          $scope.closeAllBubbles();
        }); 

        // Any time the bounds are changed on the map, ensure that we don't zoom past a maximum amount of 16
        google.maps.event.addListener(map, 'bounds_changed', function(event) {
            if (this.getZoom() > 16) {
                // Change max/min zoom here
                this.setZoom(16);
                this.initialZoom = false;
            }
        });

        // Regenerate all pins on the map
        $scope.$on('generateMapPins', function() {
          $timeout(function() {
            $scope.clearMarkers();            
            // Initialize map
            if($scope.vendors != undefined) {
              // If we have passed a list of vendors into the map, generate pins for all their selling locations
              for(var i = 0; i < $scope.vendors.length; i++) {
                  var vendor = $scope.vendors[i];
                  vendor.markers = [];

                  if(vendor.selling_locations) {
                      for(var j = 0; j < vendor.selling_locations.length; j++) {
                          var sellingLocation = vendor.selling_locations[j];

                          // Create info bubbles for each selling location
                          var infoTemplate = $scope.getVendorInfoTemplate(sellingLocation, vendor);
                          var center = new google.maps.LatLng(sellingLocation.address.latitude, sellingLocation.address.longitude);
                          vendor.markers.push($scope.createMarker(center, infoTemplate));
                      }
                  }
              }
            } 

            if($scope.markets != undefined) {
              // If we have passed a list of markets into the map, generate pins for all of these
              for(var i = 0; i < $scope.markets.length; i++) {
                  var market = $scope.markets[i];

                  // Create info bubbles for each market
                  var infoTemplate = $scope.getMarketInfoTemplate(market);
                  var center = new google.maps.LatLng(market.address.latitude, market.address.longitude);
                  market.marker = $scope.createMarker(center, infoTemplate);
              }
            }

            if($scope.locations != undefined) {
              // If we have passed a list of selling locations into the map, generate pins for all of these
              for(var i = 0; i < $scope.locations.length; i++) {
                  var sellingLocation = $scope.locations[i];

                  // Create info bubbles for each selling location
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

        // Helper function to create a new marker on the map. Without this, each time we loop through locations and create markers, each marker would replace
        // the one generated before it.
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

        // Nasty HTML in JavaScript template for market info bubbles
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

        // Nasty HTML in JavaScript template for vendor info bubbles
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
             '<a href="http://maps.google.com/?q=' +
             object.address.latitude + ',' + object.address.longitude + '" target="_blank" >' +
             '<span class="info-window-text">' + 
             object.address.addr_line1 + ', ' + object.address.state + ', ' + object.address.country +  
             '</span>' +  
             '</a>' + 
             '</p><br>' +
             '</div>' + 
            '</div>';

            return infoTemplate;           
        }

        // Nasty HTML in JavaScript template for selling location info bubbles
        $scope.getLocationInfoTemplate = function(object) {
            var infoTemplate = '' + 
            '<div class="info-window-content">' + 
            '<div>' +
            '<h5 class="no-bottom-margin">' + 
            '<span class="vendor-card-name">' +
             object.name  + 
             '</span>' + 
             '</h5>' +
             '<p class="plain-text info-window-text">' + 
             '<span class="info-window-text">' + 
             '<a href="http://maps.google.com/?q=' +
             object.address.latitude + ',' + object.address.longitude + '" target="_blank" >' +
             '<span class="info-window-text">' + 
             object.address.addr_line1 + ', ' + object.address.state + ', ' + object.address.country +  
             '</span>' +  
             '</a>' +
             '</p><br>' +
             '</div>' + 
            '</div>';

            return infoTemplate;           
        }        

        // Refreshing the map causes it to calculate the smallest bounding box that is able to display all markers and zoom to fit that box.
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

        // If the current user is a vendor and they have clicked themselves, take them to their vendor page.
        // Otherwise, take them to the vendor details page for the vendor they have clicked        
        $scope.displayVendor = function (id) {
          var user = StateService.getCurrentUser();
          if(user && user.userType === 'VEN' && user.vendor.id === id) {
            $location.path('/vendor');
          } else {            
            $location.path('vendor/details/'+ id);
          }
        };

        // Display market details page for a given market
        $scope.displayMarket = function (id) {
          $location.path('market/details/'+id).replace();
        };        

      }     
    };
  });
