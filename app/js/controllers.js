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

    }

  }])
  .controller('mainDataController', function($scope, dashboardAPIService) {
  	  dashboardAPIService.makeAPIRequest('recent', '40').success(function(response){
        var totalHits = 0;
        var data = response.latest;

        angular.forEach(data, function(post, key){
          totalHits += parseInt(post.hits, 10);
        });

        $scope.posts = data;
        $scope.totalHits = totalHits;
      });
  });
