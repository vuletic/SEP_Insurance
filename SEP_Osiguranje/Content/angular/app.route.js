(function () {
    'use strict';

    angular
		.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/home");

      $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'Content/angular/app/components/core/home.html',
            controller: 'homeController',
            controllerAs: 'hc'
        })
        .state('prices', {
            url: '/prices',
            templateUrl: 'Content/angular/app/components/prices/prices.html',
            controller: 'pricesController',
            controllerAs: 'pc'
        });
        }]);


})();
