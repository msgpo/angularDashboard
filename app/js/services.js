'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('dashboardAPIService', function($http) {
    var dashboardAPI = {};


    dashboardAPI.makeAPIRequest = function(type, options) {
      options = options || {};
      var apiUrl = 'http://www.shareonfb.com/server/';   
      var limit = options.limit;
      var method = 'GET';

      //For status toggle
      var hash = options.hash;
      var postStatus = options.status;
      var dateRange = options.dateRange

      var logo = options.logo;
      var headline = options.headline;
      var description = options.description;
      var reveal = options.reveal;
      console.log(options);
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
      } else if (type === 'usersOnline') {
        apiUrl += 'userOnlineCount.php';
      } else if (type === 'visits') {
        apiUrl += 'visitorStats.php';
      } else if (type === 'overallStats') {
        apiUrl += 'overallStats.php';
      } else if (type === 'fixThumbnail') {
        apiUrl += 'update.php?hash=' + hash;
      } else if (type === 'update') {
        apiUrl += 'update.php?hash=' + hash + '&logo=' + logo  + '&headline=' + headline + '&description=' + description + '&reveal=' + reveal;
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
