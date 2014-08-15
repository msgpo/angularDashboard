'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/mainContent.html', controller: 'menuPanelController'});
  $routeProvider.when('/Chat', {templateUrl: 'partials/chat.html', controller: 'chatController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
