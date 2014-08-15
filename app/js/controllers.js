'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('mainAppController',['$scope', function($scope) {
    $scope.currentLocation = 'Latest';
    $scope.type = 'recent';
    $scope.limit = '40';
    $scope.posts = [];

    $scope.totalHits = 0;
  }])
  .controller('menuPanelController', ['$scope', 'dashboardAPIService', function($scope, dashboardAPIService) {
    $scope.menuItems = ['Create', 'Popular', 'Latest', 'Flagged', 'Chat', 'Preferences'];

    $scope.menuClicked = function(menuItem) {
      $scope.currentLocation = menuItem;
      $scope.isChat = false;

      if (menuItem === 'Chat') {
        $scope.isChat = true;
      }

      var type = menuItem.toLowerCase();
      var limit = '40';

      dashboardAPIService.makeAPIRequest(type, limit).success(function(response){
        var totalHits = 0;
        var data = response.latest;

        angular.forEach(data, function(post, key){
          totalHits += parseInt(post.hits, 10);

          //Status Parsing: 0 = alive, 1=banned
          if (post.banned === '0') {
            post.banned = 'active';
          } else {
            post.banned = 'banned';
          }
        });

        $scope.posts = data;
        $scope.totalHits = totalHits;
      });

    };

  }])
  .controller('mainDataController', function($scope, dashboardAPIService) {

      $scope.sortOrder = null;

      //Table category headers
      $scope.tableCategoryHeaders = ['No.', 'Preview', 'Hash', 'Time', 'Headline', 'Hits', 'Author', 'Status', 'Actions', 'Error'];

      //Default, when controller inits, we wanna show recent 40 posts as the default presentation
      dashboardAPIService.makeAPIRequest('recent', '40').success(function(response){
        
        //Get data and bind to $scope.posts and bind it to $scope.totalHits
        var data = response.latest;
        $scope.posts = data;

        //Tally up all the hits to display on the UI
        var totalHits = 0; 
        angular.forEach(data, function(post, key){
          //total Hits
          totalHits += parseInt(post.hits, 10);

          //Status Parsing: 0 = alive, 1=banned
          if (post.banned === '0') {
            post.banned = 'active';
          } else {
            post.banned = 'banned';
          }

          //image processing, wrong file extension
          if (post.logo.indexOf('.png') === -1 && post.logo.indexOf('.jpg') === -1 && post.logo.indexOf('.gif') === -1) {
            post.logo = 'http://placehold.it/50x37';
            post.error = 'Bad image';
          }


        });

        $scope.totalHits = totalHits;

      });

      //Sort Header
      $scope.sortHeader = function(header) {
        $scope.sortOrder = header;
      };

      //RefreshData
      $scope.refreshData = function(hash) {

        var type = $scope.currentLocation.toLowerCase();
        var limit = prompt('how many entries do you want?');

        //this should be modularized and make reusable.
        dashboardAPIService.makeAPIRequest('recent', limit).success(function(response){
          
          //Get data and bind to $scope.posts and bind it to $scope.totalHits
          var data = response.latest;
          $scope.posts = data;

          //Tally up all the hits to display on the UI
          var totalHits = 0; 
          angular.forEach(data, function(post, key){
            //total Hits
            totalHits += parseInt(post.hits, 10);

            //Status Parsing: 0 = alive, 1=banned
            if (post.banned === '0') {
              post.banned = 'active';
            } else {
              post.banned = 'banned';
            }
          });

          $scope.totalHits = totalHits;

        });
      };

  });
