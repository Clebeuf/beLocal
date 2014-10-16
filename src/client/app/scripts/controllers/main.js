'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $timeout, StateService) {

    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    })

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    });

    $timeout(function() {
		var container = document.querySelector('#masonry-container');
		var msnry = new Masonry(container, {
		  itemSelector: '.ms-item',
		  columnWidth: '.ms-item'
		});    
    }, 1000)

/* Uncomment this for actual data (non-hardcoded)
    StateService.getMarkets().then(function() {
    	$scope.marketlist = StateService.getMarketList();
      console.log($scope.marketlist);
    })

*/

    //This is hardcoded data
    StateService.getMarkets().then(function() {
      $scope.marketlist = [
        {
          "name":"The Nice Market",
          "addr_line1":"9079 Interesting Ave.",
          "addr_type":"MAR",
          "city":"Victoria",
          "country":"Canada",
          "state":"BC",
          "zipcode":"5p69i3",
          "running_info":"Monday to Friday",
          "hours":"9:00am to 3:00pm"
        },

        {
          "name":"Local Marketplace",
          "addr_line1":"9760 Douglas St.",
          "addr_type":"MAR",
          "city":"Saanich",
          "country":"Canada",
          "state":"BC",
          "zipcode":"9i91r3",
          "running_info":"Every Wednesday",
          "hours":"9:00am to 4:00pm"
        }

      ]
    })


  });
