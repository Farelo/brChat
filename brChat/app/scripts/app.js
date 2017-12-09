'use strict';

/**
 * @ngdoc overview
 * @name brChatApp
 * @description
 * # brChatApp
 *
 * modulo principal da aplicação.
 */
angular
  .module('brChatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pubnub.angular.service'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/join', {
        templateUrl: 'views/join.html',
        controller: 'JoinCtrl'
      })
      .otherwise({
        redirectTo: '/join'
      });
  });
