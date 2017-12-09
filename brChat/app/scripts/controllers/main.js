'use strict';

/**
 * @ngdoc function
 * @name brChatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller do brChat
 */
angular.module('brChatApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'PubNub', function ($scope, $rootScope, $location, PubNub) {
   	var _ref;
    if (!PubNub.initialized()) {
      $location.path('/join');
    }
    
    // canal de controle pra coletar as mensagens da criação de sala
    $scope.controlChannel = '__controlchannel';
    
    $scope.channels = [];

    // publicar chat
    $scope.publish = function(){
    	if(!$scope.selectedChannel){
   			return;
   		}
   		PubNub.ngPublish({
   			channel: $scope.selectedChannel,
   			message: {
   				text:$scope.newMessage,
   				user: $scope.data.username
   			}
   		});
   		return $scope.newMessage = '';
    }

   	// Cria canal
   	$scope.createChannel = function(){
   		var channel;
   		console.log('Criando canal...');
   		channel = $scope.newChannel;

   		$scope.newChannel = '';

   		PubNub.ngGrant({
   			channel: channel,
   			read: true,
   			write: true,
   			callback: function(){
   				return console.log(channel + 'Tudo pronto', arguments);
   			}
   		});

   		PubNub.ngGrant({
   			channel: channel+'-pnpres',
   			read: true,
   			write: false,
   			callback: function(){
   				return console.log(channel + 'Presence All Set', arguments);
   			}
   		});

   		PubNub.ngPublish({
   			channel: $scope.controlChannel,
   			message: channel
   		});

   		return setTimeout(function(){
   			$scope.subscribe(channel);
   			return $scope.showCreate = false;
   		}, 100);
   	}

   	$scope.subscribe = function(channel){
   		var _ref;
   		console.log('se escrevendo...');
   		if(channel === $scope.selectedChannel){
   			return;
   		}
   		if($scope.selectedChannel){
   			PubNub.ngUnsubscribe({
   				channel: $scope.selectedChannel
   			});
   		}
   		$scope.selectedChannel = channel;
   		$scope.messages = ['Bem vindo ao '+channel];
   		PubNub.ngSubscribe({
   			channel: $scope.selectedChannel,
   			state:{
   				"cidade": ((_ref = $rootScope.data) != null ? _ref.city : void 0) || 'desconhecido'
   			},
   			error: function(){
   				return console.log(arguments);
   			}
   		});

   		$rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel), function(ngEvent, payload) {
        return $scope.$apply(function() {
          var newData, userData;
          userData = PubNub.ngPresenceData($scope.selectedChannel);
          newData = {};
          $scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel), function(x) {
            var newX;
            newX = x;
            if (x.replace) {
              newX = x.replace(/\w+__/, "");
            }
            if (x.uuid) {
              newX = x.uuid.replace(/\w+__/, "");
            }
            newData[newX] = userData[x] || {};
            return newX;
          });
          return $scope.userData = newData;
        });
      });
        
      PubNub.ngHereNow({
        channel: $scope.selectedChannel
      });
        
      $rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel), function(ngEvent, payload) {
        var msg;
        msg = payload.message.user ? "[" + payload.message.user + "] " + payload.message.text : "[desconhecido] " + payload.message;
        return $scope.$apply(function() {
          return $scope.messages.unshift(msg);
        });
      });
        
      return PubNub.ngHistory({
        channel: $scope.selectedChannel,
        auth_key: $scope.authKey,
        count: 500
      });
    };
    
    
    // Subscribe para baixar canais "canal de controle"
    PubNub.ngSubscribe({
      channel: $scope.controlChannel
    });
    
    
    // registra pro canal a criação de eventos
    $rootScope.$on(PubNub.ngMsgEv($scope.controlChannel), function(ngEvent, payload) {
      return $scope.$apply(function() {
        if ($scope.channels.indexOf(payload.message) < 0) {
          return $scope.channels.push(payload.message);
        }
      });
    });
    
    
    // pega um historico de mensagens pra aumentar a lista de canais
    PubNub.ngHistory({
      channel: $scope.controlChannel,
      count: 500
    });

    // cria um "Waiting Room" 
    $scope.newChannel = 'Sala de espera';
    return $scope.createChannel();
  }]);
