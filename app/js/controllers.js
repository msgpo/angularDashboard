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
    $scope.menuItems = ['Create', 'Popular', 'Latest', 'Flagged'];

    $scope.menuClicked = function(menuItem) {
      $scope.currentLocation = menuItem;
      var type = menuItem.toLowerCase();
      var limit = '40';

      dashboardAPIService.makeAPIRequest(type, limit).success(function(response){
        var totalHits = 0;
        var data = response.latest;

        angular.forEach(data, function(post, key){
          totalHits += parseInt(post.hits, 10);
        });

        $scope.posts = data;
        $scope.totalHits = totalHits;
      });

    };

  }])
  .controller('mainDataController', function($scope, dashboardAPIService) {

      $scope.sortOrder = null;

      //Table category headers
      $scope.tableCategoryHeaders = ['No.', 'Preview', 'Hash', 'Time', 'Headline', 'Hits', 'Author', 'Status', 'Remove'];

      //Default, when controller inits, we wanna show recent 40 posts as the default presentation
      dashboardAPIService.makeAPIRequest('recent', '40').success(function(response){
        
        //Get data and bind to $scope.posts and bind it to $scope.totalHits
        var data = response.latest;
        $scope.posts = data;

        //Tally up all the hits to display on the UI
        var totalHits = 0; 
        angular.forEach(data, function(post, key){
          totalHits += parseInt(post.hits, 10);
        });

        $scope.totalHits = totalHits;

      });

      //Sort Header
      $scope.sortHeader = function(header) {
        $scope.sortOrder = header;
      };

  });
