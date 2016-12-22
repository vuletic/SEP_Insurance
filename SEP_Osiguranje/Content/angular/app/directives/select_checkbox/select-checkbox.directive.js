(function () {
    'use strict';

    angular
		.module('app')
		.directive('selectCheckbox', selectCheckbox);

    selectCheckbox.$inject = ['$http'];
    function selectCheckbox($http) {
        var selectCheckboxDirective = {
            restrict: 'E',
            transclude: true,
            templateUrl: "../Content/angular/app/directives/select_checkbox/select-checkbox.html",
            scope: {
                selectEnabled: '='
            }
        };
        return selectCheckboxDirective;
    }
})();