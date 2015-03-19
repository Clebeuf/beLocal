'use strict';

angular.module('clientApp')
    .service('DateService', function DateService() {
        this.minDate = new Date();

        this.getDate = function(date) {
            if(date == null)
                return -1;
            
            if(date.getDay() == 0)
                return 7;
            else
                return date.getDay();
        };

        this.addDays = function(d, n) {
            d.setDate(d.getDate() + n);
            return d;
        };              

        // Compare two dates to see if they are equal. (This is necessary in order to ignore times)
        // Also use getFullYear() and not getYear(). 
        this.compareDates = function(date1, date2) {
            if(date1 == null || date2 == null)
                return false;
            if(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())
                return true;
            else
                return false;
        };  
        
        this.isBeforeRecurrence = function(today, startDate) {
            return today.getTime() < startDate.getTime();
        };    

        this.isInsideRecurrence = function(today, startDate, endDate) {
            if(endDate == undefined)
                return today.getTime() > startDate.getTime() || this.compareDates(today, startDate);
            else
                return (today.getTime() < endDate.getTime() && today.getTime() > startDate.getTime() && this.minDate.getTime()) || (this.compareDates(today, startDate) || this.compareDates(today, endDate));
        };

        this.checkEndDate = function(today, endDate) {
            if(endDate == null || this.compareDates(today, endDate))
                return true;

            if(today.getTime() > endDate.getTime())
                return false;
            else
                return true;
        };

        this.addDays = function(d, n) {
            d.setDate(d.getDate() + n);
            return d;
        };

        this.getMonday = function(d) {
          d = new Date(d);
          var day = d.getDay(),
              diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
          return new Date(d.setDate(diff));
        };

        this.initDate = function(d) {
            if(d == null)
                return null;

            var date = new Date(d)
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
            return date;        
        };

        this.showDates = function(location) {
            return location != undefined && location.recurrences && location.address.hours.length !== 0 && this.checkEndDate(this.minDate, this.initDate(location.recurrences.end_date));
        };

        this.showOpenString = function(location) {
            return location != undefined && location.recurrences && this.isInsideRecurrence(this.minDate, this.initDate(location.recurrences.start_date), this.initDate(location.recurrences.end_date)) && location.address.hours.length != 0;            
        };

        this.showReopeningString = function(location) {
            return location != undefined && location.recurrences && this.isBeforeRecurrence(this.minDate, this.initDate(location.recurrences.start_date));
        };

        this.showThisWeekString = function(location) {
            return location != undefined && location.recurrences && this.compareDates(this.getMonday(this.minDate), this.initDate(location.recurrences.next));
        };

        this.hideTheWeekOfContainer = function(location) {
            return location != undefined && location.recurrences && this.compareDates(this.getMonday(this.minDate), this.initDate(location.recurrences.next));
        };

        this.showTheWeekOfString = function(location) {
            return location != undefined && location.recurrences && this.checkEndDate(this.minDate, this.initDate(location.recurrences.end_date));
        };

        this.showClosedForTheSeasonString = function(location) {
            if(location == undefined || (!location.recurrences && location.address.hours.length !== 0))
                return false
            else
                return location.address.hours.length === 0 || !this.checkEndDate(this.minDate, this.initDate(location.recurrences.end_date));            
        };

        this.hideWeekdayContainer = function(location) {
            if(location == undefined || (!location.recurrences && location.address.hours.length !== 0))
                return false
            else
                return location.address.hours.length === 0 || !this.checkEndDate(this.minDate, this.initDate(location.recurrences.end_date));
        };

        this.hideWeekday = function(location, day) {
            if(location == undefined || !location.recurrences)
                return false
            else
                return this.compareDates(this.getMonday(this.minDate), this.initDate(location.recurrences.start_date)) && (day.weekday < this.getDate(this.initDate(location.real_start))) || 
                (location.recurrences.end_date && this.compareDates(this.getMonday(this.minDate), this.getMonday(this.initDate(location.recurrences.end_date))) && (day.weekday > this.getDate(this.initDate(location.recurrences.end_date))));
            // return this.compareDates(this.getMonday(this.minDate), this.initDate(location.recurrences.start_date)) && 
            // this.compareDates(this.getMonday(this.minDate), this.initDate(location.recurrences.next)) && 
            // (day.weekday < this.getDate(this.initDate(location.real_start))) || (this.checkEndDate(this.minDate, this.initDate(location.recurrences.end_date)) && 
            //     (day.weekday < this.getDate(this.initDate(location.real_start))));            
        };        
    });
