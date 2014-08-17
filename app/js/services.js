'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('dashboardAPIService', function($http) {
    var dashboardAPI = {};


    dashboardAPI.makeAPIRequest = function(type, options) {
      var apiUrl = 'http://www.shareonfb.com/server/';   
      var limit = options.limit;
      var method = 'GET';

      //For status toggle
      var hash = options.hash;
      var postStatus = options.status;
      var dateRange = options.dateRange

      if (type === 'latest') {
        apiUrl += 'recent.php?limit=' + limit;
      } else if (type === 'popular') {
        apiUrl += 'popular.php?limit=' + limit;
      } else if (type === 'reported') {
        apiUrl += 'banned.php?limit=' + limit;
      } else if (type === 'delete') {
        apiUrl += 'delete.php?hash=' + hash;
      } else if (type === 'setflagged') {
        apiUrl += 'setflagged.php?hash=' + hash + '&postStatus=' + postStatus;
      } else if (type === 'report') {
        apiUrl += 'report.php' + '?dateRange='+ dateRange;
      } else {
        apiUrl += type + '.php?limit=' + limit;
      }

      var apiData = [];

      return $http({
        method: method,
        responseType: 'json',
        url: apiUrl
      });
    };

    return dashboardAPI;
  });
