'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, StateService) {
	    
    $scope.showProductDetailsModal = function(item) {
    	$scope.product = item;   	
    };
	    
    $scope.hideProductDetailsModal = function() {   
    	$scope.product = {};    		
    };
    
    $scope.goToVendorDetails = function(vendorID){
    	$scope.hideProductDetailsModal();


      angular.element('#productDetailsModal').on('hidden.bs.modal', function(e) {
        $timeout(function() {
      	 $location.path('vendor/details/'+ vendorID).replace();
        });
      });
      angular.element('#productDetailsModal').modal('hide');      
    };
    
    $scope.likeUnLikeItem = function(item, itemName) {
      StateService.likeUnlikeItem(item, itemName).then(function() {
        item = StateService.getLikedUnlikedItem();
      });
    };
    
    StateService.getTrendingProducts().then(function() {
      $scope.trendingProducts = StateService.getTrendingProductsList();
    });

    StateService.getVendors().then(function() {
    	$scope.vendors = StateService.getVendorsList();
    });

    $scope.trendingMasonry = function() {
	    $timeout(function() {
			var container = document.querySelector('#masonry-container');
			var msnry = new Masonry(container, {
			  itemSelector: '.ms-item',
			  columnWidth: '.ms-item'
			});    
	    }, 1000)
	};

    $scope.marketMasonry = function() {
		var container = document.querySelector('#masonry-market-container');
		var msnry = new Masonry(container, {
		  itemSelector: '.ms-market-item',
		  columnWidth: '.ms-market-item'
		});    
	};

	/* Magic! This is a hacky way of ensuring that masonry rebuilds itself while the proper tab content pane is visible
	   (it won't work otherwise) */
	angular.element('a[data-toggle="tab"]').on('shown.bs.tab', function (e) { 
		angular.element(e.target).triggerHandler('click');
	})

/* Uncomment this for actual data (non-hardcoded)
    StateService.getMarkets().then(function() {
    	$scope.marketlist = StateService.getMarketList();
      console.log($scope.marketlist);
    })

*/

    //This is hardcoded data
    StateService.getMarkets().then(function() {
      $scope.marketList = [
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

    $scope.trendingMasonry();
    $scope.marketMasonry();

  });


