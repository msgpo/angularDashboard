'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'chartjs'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/overview.html', controller: 'overviewController'});
  $routeProvider.when('/Overview', {templateUrl: 'partials/overview.html', controller: 'overviewController'});
  $routeProvider.when('/Popular', {templateUrl: 'partials/mainContent.html', controller: 'mainContentController'});
  $routeProvider.when('/Latest', {templateUrl: 'partials/mainContent.html', controller: 'mainContentController'});
  $routeProvider.when('/Flagged', {templateUrl: 'partials/flagged.html', controller: 'mainContentController'});
  $routeProvider.when('/Chat', {templateUrl: 'partials/chat.html', controller: 'mainContentController'});
  $routeProvider.when('/Preferences', {templateUrl: 'partials/preferences.html', controller: 'mainContentController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
