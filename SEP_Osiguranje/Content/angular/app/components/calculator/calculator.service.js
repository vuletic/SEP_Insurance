﻿(function () {
    'use strict';

    angular
		.module('app')
		.service('calculatorService', calculatorService);

    calculatorService.$inject = ['$http'];
    function calculatorService($http) {

        function sendCalculateData(data) {
            var resUrl = 'http://localhost:8080/rules';
            return $http.post(resUrl, data)
            .then(function (response) {
                return response.data;
            });
        }

       
        return {
            sendCalculateData: sendCalculateData
        };
    }


})();