'use strict';

describe('Controller: AboutCtrl', function () {

  // carrega o modulo de controle
  beforeEach(module('brChatApp'));

  var AboutCtrl,
    scope;

  // inicializa o controller e o escopo do mock
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AboutCtrl = $controller('AboutCtrl', {
      $scope: scope
    });
  }));

  it('deve ligar a lista de awesomeThings pro scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
