(function () {
    'use strict';

    angular
		.module('app')
        .config(function ($routeProvider) {
            $routeProvider
            .when("/home", {
                templateUrl: "home.html"
            })
            .when("/test", {
                templateUrl: "./app/testComponent/test.html"
            })
            .otherwise({
                redirectTo: "/home"
            });
        });
})();
