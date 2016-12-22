(function () {
    'use strict';

    angular
		.module('app')
		.directive('expanderSimple', expanderSimple);

    expanderSimple.$inject = ['$http'];
    function expanderSimple($http) {
        var expanderSimpleDirective = {
            restrict: 'E',
            transclude: true,
            templateUrl: "../Content/angular/app/directives/expander_simple/expander-simple.html",
            scope: {
                showExpander: '='
            }
        };
        return expanderSimpleDirective;
    }
})();