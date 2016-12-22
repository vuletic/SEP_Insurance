(function () {
    'use strict';

    angular
		.module('app')
		.directive('pageMarker', pageMarker);

    pageMarker.$inject = ['$http'];
    function pageMarker($http) {
        var pageMarkerDirective = {
            restrict: 'E',
            templateUrl: "../Content/angular/app/directives/page_marker/page-marker.html",
            scope: {
                selectedPage: '='
            }
        };
        return pageMarkerDirective;
    }
})();