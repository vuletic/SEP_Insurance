(function () {
    'use strict';

    angular
		.module('app')
		.service('processService', processService);

    processService.$inject = ['$http'];
    function processService($http) {

        this.finalizeProcess = function (data) {

            return $http.post("api/finalize", data).then(function (response) {
                return response.data;
            });

        }


    }


})();