'use strict';

angular.module('clientApp')
  .service('StateService', function StateService() {
    var currentUser = {};

    this.setProfile = function(u) {
      currentUser = u;
    };

    this.getUserType = function() {
      return currentUser.userType;
    };    

  });
