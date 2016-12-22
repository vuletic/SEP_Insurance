(function () {
    'use strict';

    angular
		.module('app')
		.directive('selectYesno', selectYesno);

    selectYesno.$inject = ['$http'];
    function selectYesno($http) {
        var selectYesnoDirective = {
            restrict: 'E',
            transclude: true,
            templateUrl: "../Content/angular/app/directives/select_yesno/select-yesno.html",
            scope: {
                selectEnabled: '='
            }
        };
        return selectYesnoDirective;
    }
})();