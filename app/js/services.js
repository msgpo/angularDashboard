'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('dashboardAPIService', function($http) {
    var dashboardAPI = {};


    dashboardAPI.makeAPIRequest = function(type, limit) {
      var apiUrl = 'http://www.shareonfb.com/server/';      
      if (type === 'latest') {
        apiUrl += 'recent.php?limit=' + limit;
      } else if (type === 'popular') {
        apiUrl += 'popular.php?limit=' + limit;
      } else if (type === 'reported') {
        apiUrl += 'banned.php?limit=' + limit;
      } else {
        apiUrl += type + '.php?limit=' + limit;
      }

      var apiData = [];

      return $http({
        method: 'GET',
        responseType: 'json',
        url: apiUrl
      });
    };


    return dashboardAPI;
  })
  .service('fetchDataService', ['dashboardAPIService', function(dashboardAPIService, type, limit) {
    this.fetchData = function (type, limit) {
      var posts = [];
      posts = dashboardAPIService.makeAPIRequest(type,limit);
    };
  }]);
