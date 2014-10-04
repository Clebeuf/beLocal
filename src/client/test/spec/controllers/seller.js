'use strict';

describe('Controller: SellerCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SellerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SellerCtrl = $controller('SellerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
