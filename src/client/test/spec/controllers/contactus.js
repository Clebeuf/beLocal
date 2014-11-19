'use strict';

describe('Controller: ContactusCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ContactusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactusCtrl = $controller('ContactusCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
