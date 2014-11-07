'use strict';

describe('Controller: MarketdetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MarketdetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MarketdetailsCtrl = $controller('MarketdetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
