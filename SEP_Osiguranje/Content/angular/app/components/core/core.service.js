(function () {
    'use strict';

    angular
		.module('app')
		.service('localization', coreService);

    coreService.$inject = ['$http'];
    function coreService($http) {

        this.getLocalizationObj = function (language) {
            return $http.get("https://infinite-meadow-14263.herokuapp.com/languages/" + language).then(function (response) {
                return response.data;
            });
        }
    }


})();