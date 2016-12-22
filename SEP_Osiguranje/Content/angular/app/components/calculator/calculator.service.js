(function () {
    'use strict';

    angular
		.module('app')
		.service('calculator', calculatorService);

    calculatorService.$inject = ['$http'];
    function calculatorService($http) {

        this.getLocalizationObj = function (language) {
            return $http.get("https://infinite-meadow-14263.herokuapp.com/languages/" + language)
                .then(function (response) {
                    return response.data;
                });
        }
    }


})();