(function () {
    'use strict';

    angular
		.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/home");

      $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'Content/angular/app/components/core/home.html'
        })
        .state('test', {
            url: '/test',
            templateUrl: 'Content/angular/app/components/testComponent/test.html'
        });
        }]);


})();
