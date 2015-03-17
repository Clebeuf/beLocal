'use strict';
angular.module('clientApp')
  .directive('marketCard', function (StateService, $timeout, $compile, $location, $filter) {
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

        // This is a silly hack I had to make since on the server, I accidentally started dates with 0 = Monday rather than 0 = Sunday. 
        // As a result, we need to put this everywhere to ensure that dates coming back from the server are parsed correctly on the client
        scope.getDate = function(date) {
            if(date.getDay() == 0)
                return 7;
            else
                return date.getDay();
        }      

        // Compare two dates regardless of time
        scope.compareDates = function(date1, date2) {
            if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
                return true;
            else
                return false;
        }

        scope.isBeforeRecurrence = function(today, startDate) {
            return today.getTime() < startDate.getTime();
        }    

        scope.isInsideRecurrence = function(today, startDate, endDate) {
            if(endDate == undefined)
                return today.getTime() > startDate.getTime() || scope.compareDates(today, startDate);
            else
                return (today.getTime() < endDate.getTime() && today.getTime() > startDate.getTime()) || (scope.compareDates(today, startDate) || scope.compareDates(today, endDate));
        }

        scope.checkEndDate = function(today, endDate) {
            if(endDate == null || scope.compareDates(today, endDate))
                return true;

            if(today.getTime() > endDate.getTime())
                return false;
            else
                return true;
        }

        scope.addDays = function(d, n) {
            d.setDate(d.getDate() + n);
            return d;
        }         

        scope.initDate = function(d) {
            if(d == null)
                return null;

            var date = new Date(d)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
            return date;        
        }                
        
        // Genenerate a string that says whether a specific market is open or closed today.
        scope.generateOpeningString = function() {
            // Check if open today first
            for(var j = 0; j < scope.market.address.hours.length; j++) {
                var today = scope.getDate(new Date());
                if(scope.market.address.hours[j].weekday == today && scope.isInsideRecurrence(scope.initDate(new Date()), scope.initDate(scope.market.real_start), scope.initDate(scope.market.recurrences.end_date))) {
                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Open today:</span></strong> " + scope.market.address.hours[j].from_hour + ' - ' + scope.market.address.hours[j].to_hour;
                }
            }

            if(scope.openString === undefined && scope.market.recurrences && scope.market.recurrences.next && scope.market.address.hours.length != 0) {
                var nextDate = scope.initDate(scope.market.recurrences.next);

                // If we're not inside a our recurrence, we should do something about that.
                if(!scope.isInsideRecurrence(nextDate, scope.initDate(scope.market.real_start), scope.initDate(scope.market.recurrences.end_date))) {
                    // Adjust if necessary to ensure we're inside recurrence
                    while(!scope.isInsideRecurrence(nextDate, scope.initDate(scope.market.real_start), scope.initDate(scope.market.recurrences.end_date)))
                        nextDate = scope.addDays(nextDate, 1);

                    // Calculate which day we're going to display
                    var dayShift = 0;
                    for(var j = 0; j < scope.market.address.hours.length; j++) {
                        if(scope.market.address.hours[j].weekday < scope.getDate(nextDate))
                            continue;

                        dayShift = scope.market.address.hours[j].weekday;
                        break;

                    }

                    nextDate = scope.addDays(nextDate, dayShift - scope.getDate(nextDate));
                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Next open: </span></strong>" + $filter('date')(nextDate, "MMMM d") + ' from ' + scope.market.address.hours[scope.getDate(nextDate) - 1].from_hour + ' - ' + scope.market.address.hours[scope.getDate(nextDate) - 1].to_hour;
                    return;
                } else if(scope.isInsideRecurrence(scope.currentDate, scope.initDate(scope.market.recurrences.start_date), scope.initDate(scope.market.recurrences.end_date))) {
                    // We are inside the current recurrence
                    nextDate = new Date();
                    while(scope.getDate(nextDate) < scope.market.address.hours[0].weekday)
                        nextDate = scope.addDays(nextDate, 1);

                    scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Next open: </span></strong>" + $filter('date')(nextDate, "MMMM d") + ' from ' + scope.market.address.hours[0].from_hour + ' - ' + scope.market.address.hours[0].to_hour;                    
                }

            }

            // // If it's not open today, get the next day the market will be open
            // if(scope.openString === undefined) {
            //     var today = scope.getDate(new Date());

            //     for(var j = 0; j < scope.market.address.hours.length; j++) {
            //         var nextDayOpen = 0;
            //         if(scope.market.address.hours[j].weekday >= today) {
            //             nextDayOpen = j;

            //             if(nextDayOpen < scope.market.address.hours.length) {
            //                 scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Open " + scope.weekdays[scope.market.address.hours[nextDayOpen].weekday - 1] + ":</span></strong> " +  scope.market.address.hours[nextDayOpen].from_hour + ' - ' + scope.market.address.hours[nextDayOpen].to_hour;
            //                 return;
            //             }
            //         }
            //         scope.openString = "<strong><span class='glyphicon glyphicon-time'></span>&nbsp;<span class='hours-string'>Open " + scope.weekdays[scope.market.address.hours[0].weekday - 1] + "</span></strong>: " +  scope.market.address.hours[0].from_hour + ' - ' + scope.market.address.hours[0].to_hour;
            //     }                    
            // }
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