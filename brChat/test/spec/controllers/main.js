'use strict';

describe('Controller: MainCtrl', function () {

  // carrega o modulo de controle
  beforeEach(module('brChatApp'));

  var MainCtrl,
    scope;

  // inicializa o controller e o escopo do mock
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('deve ligar a lista de awesomeThings pro scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
