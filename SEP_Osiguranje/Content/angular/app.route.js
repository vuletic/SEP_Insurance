(function () {
    'use strict';

    angular
		.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/process");

      $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'Content/angular/app/components/core/home.html',
            controller: 'homeController',
            controllerAs: 'hc'
        })
        .state('process', {
            url: '/process',
            templateUrl: 'Content/angular/app/components/process/process.html',
            controller: 'processController',
            controllerAs: 'pc'
        })
        .state('prices', {
            url: '/prices',
            templateUrl: 'Content/angular/app/components/prices/prices.html',
            controller: 'pricesController',
            controllerAs: 'pc'
        });
        }]);


})();
