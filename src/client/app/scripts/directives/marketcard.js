'use strict';
angular.module('clientApp')
  .directive('marketCard', function (StateService, $timeout, $compile, $location, $filter, DateService) {
    return {
      templateUrl: 'scripts/directives/marketCard.html',
      restrict: 'E',
      scope: {
        market: '=data'
      },      
      link: function postLink(scope, element, attrs) {
        scope.openString = undefined;

        // Required for displaying weekdays on the card
        scope.weekdays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];

        scope.currentDate = new Date();

        // Go to the market details page for a specific market
        scope.displayMarket = function (id) {
          $location.path('market/details/'+id);
        };

        // Make the pins bounce!
        scope.highlightPins = function(market) {
            if(market && market.marker)             
                market.marker.setAnimation(google.maps.Animation.BOUNCE);
        };

        // Stop the bouncing!
        scope.unHighlightPins = function(market) {
            if(market && market.marker) 
                market.marker.setAnimation(null);
        };              

        // Like or unlike a market
        scope.likeUnlikeItem = function(item, itemName) {
          StateService.likeUnlikeItem(item, itemName).then(function() {
            item = StateService.getLikedUnlikedItem();
          });
        };             

        // Genenerate a string that says whether a specific market is open or closed today.
        scope.generateOpeningString = function() {
            // Check if open today first
            for(var j = 0; j < scope.market.address.hours.length; j++) {
                var today = DateService.getDate(new Date());
                if(scope.market.address.hours[j].weekday == today && scope.market.recurrences && DateService.isInsideRecurrence(DateService.initDate(new Date()), DateService.initDate(scope.market.real_start), DateService.initDate(scope.market.recurrences.end_date))) {
                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Open today:</span></strong> " + scope.market.address.hours[j].from_hour + ' - ' + scope.market.address.hours[j].to_hour;
                }
            }

            if(scope.openString === undefined && scope.market.recurrences && scope.market.recurrences.next && scope.market.address.hours.length != 0) {
                var nextDate = DateService.initDate(scope.market.recurrences.next);

                // If we're not inside a our recurrence, we should do something about that.
                if(!DateService.isInsideRecurrence(nextDate, DateService.initDate(scope.market.real_start), DateService.initDate(scope.market.recurrences.end_date))) {
                    // Adjust if necessary to ensure we're inside recurrence
                    while(!DateService.isInsideRecurrence(nextDate, DateService.initDate(scope.market.real_start), DateService.initDate(scope.market.recurrences.end_date)))
                        nextDate = DateService.addDays(nextDate, 1);

                    // Calculate which day we're going to display
                    var dayShift = 0;
                    for(var j = 0; j < scope.market.address.hours.length; j++) {
                        if(scope.market.address.hours[j].weekday < DateService.getDate(nextDate))
                            continue;

                        dayShift = scope.market.address.hours[j].weekday;
                        break;

                    }

                    nextDate = DateService.addDays(nextDate, dayShift - DateService.getDate(nextDate));
                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Next open: </span></strong>" + $filter('date')(nextDate, "MMMM d") + ' from ' + scope.market.address.hours[DateService.getDate(nextDate) - 1].from_hour + ' - ' + scope.market.address.hours[DateService.getDate(nextDate) - 1].to_hour;
                    return;
                } else if(DateService.isInsideRecurrence(scope.currentDate, DateService.initDate(scope.market.recurrences.start_date), DateService.initDate(scope.market.recurrences.end_date))) {
                    // We are inside the current recurrence
                    nextDate = new Date();

                    if(DateService.getDate(nextDate) > scope.market.address.hours[0].weekday) {
                        nextDate = DateService.getMonday(DateService.addDays(nextDate, 7));
                    }

                    while(DateService.getDate(nextDate) < scope.market.address.hours[0].weekday)
                        nextDate = DateService.addDays(nextDate, 1);

                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Next open: </span></strong>" + $filter('date')(nextDate, "MMMM d") + ' from ' + scope.market.address.hours[0].from_hour + ' - ' + scope.market.address.hours[0].to_hour;                    
                }

            } else if(scope.openString === undefined && scope.market.address.hours.length != 0) {
                var today = DateService.getDate(new Date());

                for(var j = 0; j < scope.market.address.hours.length; j++) {
                    var nextDayOpen = 0;
                    if(scope.market.address.hours[j].weekday >= today) {
                        nextDayOpen = j;

                        if(nextDayOpen < scope.market.address.hours.length) {
                            scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Open " + scope.weekdays[scope.market.address.hours[nextDayOpen].weekday - 1] + ":</span></strong> " +  scope.market.address.hours[nextDayOpen].from_hour + ' - ' + scope.market.address.hours[nextDayOpen].to_hour;
                            return;
                        }
                    }
                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Open " + scope.weekdays[scope.market.address.hours[0].weekday - 1] + "</span></strong>: " +  scope.market.address.hours[0].from_hour + ' - ' + scope.market.address.hours[0].to_hour;
                }           
            }
        }

        // Generate opening string on first load for each card
        scope.generateOpeningString();

        // Enable/disable liking
        if (StateService.getCurrentUser() === undefined) {
          scope.likeDisabled = true;
        } else {
          scope.likeDisabled = false;
        }  

        // Initialize tooltips
        $timeout(function(){
            angular.element("[data-toggle='tooltip']").tooltip();
        });
      }
    };
  });