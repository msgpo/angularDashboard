'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('mainAppController',['$scope', function($scope) {
    $scope.currentLocation = 'Latest';
    $scope.type = 'recent';
    $scope.limit = '40';
    $scope.posts = [];
  }])
  .controller('menuPanelController', ['$scope', 'dashboardAPIService', function($scope, dashboardAPIService) {
    $scope.menuItems = ['Create', 'Popular', 'Latest', 'Flagged'];

    $scope.menuClicked = function(menuItem) {
      $scope.currentLocation = menuItem;
      var type = menuItem.toLowerCase();
      var limit = '40';

      dashboardAPIService.makeAPIRequest(type, limit).success(function(response){
        $scope.posts = response.latest;
      });

    }

  }])
  .controller('mainDataController', function($scope, dashboardAPIService) {
  	  dashboardAPIService.makeAPIRequest('recent', '40').success(function(response){
        $scope.posts = response.latest;
      });
  });
