(function () {
    'use strict';

    angular
		.module('app')
		.directive('expanderAdvanced', expanderAdvanced);

    expanderAdvanced.$inject = ['$http'];
    function expanderAdvanced($http) {
        var expanderAdvancedDirective = {
            restrict: 'E',
            transclude: true,
            templateUrl: "../Content/angular/app/directives/expander_advanced/expander-advanced.html",
            scope: {
                enableExpander: '=',
                showExpander: '='
            }
        };
        return expanderAdvancedDirective;
    }
})();