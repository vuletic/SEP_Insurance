(function () {
    'use strict';

    angular
		.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/home");

      $stateProvider
        .state('core', {
            url: '/',
            templateUrl: 'Content/angular/app/components/core/core.html',
            controller: 'coreController',
            controllerAs: 'cr'
        })
        .state('core.home', {
            url: 'home',
            templateUrl: 'Content/angular/app/components/home/home.html',
            controller: 'homeController',
            controllerAs: 'hc',
        })
        .state('core.process', {
            url: 'process',
            templateUrl: 'Content/angular/app/components/process/process.html',
            controller: 'processController',
            params: {
                data: null
            },
            controllerAs: 'pr'
        })
        .state('core.about', {
            url: 'about',
            templateUrl: 'Content/angular/app/components/about/about.html',
            controller: 'aboutController',
            controllerAs: 'ac'
        })
        .state('core.calculator', {
            url: 'calculator',
            templateUrl: 'Content/angular/app/components/calculator/calculator.html',
            controller: 'calculatorController',
            controllerAs: 'cc'
        })
        .state('core.preview', {
            url: 'preview',
            templateUrl: 'Content/angular/app/components/preview/preview.html',
            controller: 'previewController',
            params: {
                data: null,
                info: null
            },
            controllerAs: 'pc'
        });

        }]);


})();
