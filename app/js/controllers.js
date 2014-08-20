'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('mainAppController',['$scope', function($scope) {
    $scope.currentLocation = 'Overview';
    //Table category headers
    $scope.defaultTableHeaders = ['No.', 'Preview', 'Hash', 'Time', 'Headline', 'Hits', 'Author', 'Status', 'Actions', 'Error'];

  }])
  .controller('mainContentController', ['$scope', 'dashboardAPIService', function($scope, dashboardAPIService) {
    $scope.menuItems = ['Overview', 'Popular', 'Latest', 'Flagged', 'Chat', 'Preferences'];


    $scope.menuClicked = function(menuItem) {
      $scope.currentLocation = menuItem;
      $scope.isChat = false;
      $scope.tableCategoryHeaders = $scope.defaultTableHeaders;

      //overview doesnt really fall into any api call
      //todo: it should
      if (menuItem === 'Overview') {
        return;
      }

      if (menuItem === 'Chat') {
        $scope.isChat = true;
      }

      if (menuItem === 'Flagged') {
        //Table category headers
        $scope.tableCategoryHeaders = ['No.', 'hash', 'date', 'name', 'email', 'reason', 'Flag'];
      }

      var type = menuItem.toLowerCase();
      var options = {
        limit: '40'
      };

      dashboardAPIService.makeAPIRequest(type, options).success(function(response){
        var totalHits = 0;
        var data = response.latest;

        angular.forEach(data, function(post, key){

          if (menuItem !== 'Flagged') {
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
          }

        });

        $scope.posts = data;
        $scope.totalHits = totalHits;
      });

    };

    //Sort Header, todo
    $scope.sortHeader = function(header) {
      $scope.sortOrder = header;
    };

    //toggle banned Status
    $scope.toggleStatus = function(post) {
      var options = {
        hash: post.hash,
        status: post.banned
      };

      dashboardAPIService.makeAPIRequest('setflagged', options).success(function(response){
        post.banned = response.post[0].status;
      }); //makeAPIRequest
    };

    //Delete post
    $scope.deletePost = function(post) {
      var options = {
        hash: post.hash
      };

      var index = $scope.posts.indexOf(post);    
      $scope.posts.splice(index, 1); 
      dashboardAPIService.makeAPIRequest('delete', options).success(function(response){

      }); //makeAPIRequest
    };

    $scope.currentEditPost;

    $scope.edit = function(post, index) {
      $scope.currentEditPost = post;
      $scope.currentEditPost.index = index;
      $scope.editPost = true;
    }

    $scope.editSave = function(post) {
      var index = post.index;
      $scope.posts[index] = post;
      
      var options = {
        hash: post.hash,
        logo: post.logo,
        headline: post.headline,
        description: post.description,
        reveal: post.reveal
      }

      dashboardAPIService.makeAPIRequest('update', options).success(function(response){

      }).then(function(response) {
        $scope.editPost = false;
      }); //makeAPIRequest

    }

  }])
  .controller('reportController', function ($scope, dashboardAPIService, $interval, $window) {
    
    //how often to refresh dashboard, todo: make this a config
    var refreshInterval = 60000;

    //========================================
    //Users Online
    //========================================
    $scope.usersOnline = 0;
    $scope.refreshUsersOnline = function(){

      dashboardAPIService.makeAPIRequest('usersOnline').success(function(response){
        $scope.usersOnline = response.online;

         $window.document.title = '(' + $scope.usersOnline + ') ' + $scope.currentLocation;
      }).then(function(response){
        //Callback, set to true when we have data and render to the page
        $scope.fetchUsersOnlineDone = true;
      }); //makeAPIRequest
    };

    //every 30 seconds count users online
    $interval($scope.refreshUsersOnline, refreshInterval); 
    $scope.refreshUsersOnline();


    //========================================
    //Visits Today
    //========================================
    $scope.visits = 0;
    $scope.refreshVisitCount = function() {
      dashboardAPIService.makeAPIRequest('visits').success(function(response){
        $scope.visits = response.visitor;
      }).then(function(response){
        //Callback, set to true when we have data and render to the page
        $scope.fetchVisitsDone = true;
      }); //makeAPIRequest 
    };

    //every 30 seconds count users online
    $interval($scope.refreshVisitCount, refreshInterval); 
    $scope.refreshVisitCount();

    //========================================
    //OverallStats
    //========================================
    $scope.totalPranks = 0;
    $scope.totalHits = 0;

    $scope.refreshVisitCount = function() {
      dashboardAPIService.makeAPIRequest('overallStats').success(function(response){
        $scope.totalPranks = response.totalPranks;
        $scope.totalHits = response.totalHits;
      }).then(function(response){
        //Callback, set to true when we have data and render to the page
        $scope.overallStatsDone = true;
      }); //makeAPIRequest 
    };

    //every 30 seconds count users online
    $interval($scope.refreshVisitCount, refreshInterval); 
    $scope.refreshVisitCount();


    //========================================
    //Reporting Chart
    //========================================
    $scope.dateRange = 7;
    $scope.options = {
      dateRange: $scope.dateRange 
    };

    $scope.graphReports = function() {
      dashboardAPIService.makeAPIRequest('report', $scope.options).success(function(response){
        //Cache this var
        var items = response.report;

        //Process necessary graph data
        var plotLabels = [];
        var plotDataItemCount = [];
        var hitCount = [];

        //reverse them in order
        items.reverse();

        angular.forEach(items, function(item){
          plotLabels.push(item.day.replace('2014-', ''));
          plotDataItemCount.push(parseInt(item.count, 10));
          hitCount.push(parseInt(item.hits,10));
        });

        $scope.lineDataOptions = {
          pointHitDetectionRadius: 1
        };

        $scope.lineData = {
          labels: plotLabels,
          datasets: [ {
              fillColor: "rgba(28, 125, 231, 0.5)",
              strokeColor: "rgba(78, 156, 241, 1)",
              data: hitCount
          }]
        };

        $scope.barData = {
          labels: plotLabels,
          datasets: [{
              fillColor: "rgba(28, 125, 231, 0.5)",
              strokeColor: "rgba(78, 156, 241, 1)",
              data: plotDataItemCount
          }]
        };
      }).then(function(response){
        //Callback, set to true when we have data and render to the page
        $scope.fetchReportDone = true;
      }); //makeAPIRequest
    }

    $scope.graphReports();

    $scope.filterDateRange = function(range) {
      $scope.fetchReportDone = false;
      $scope.options.dateRange = range;
      $scope.graphReports();
    };

  })
  .controller('overviewController', function($scope) {
    $scope.title = 'overview';
  });
