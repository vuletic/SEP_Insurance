(function () {
    'use strict';

    angular
		.module('app')
		.service('dataAccessService', dataAccessService);

    dataAccessService.$inject = ['$http'];
    function dataAccessService($http) {

        function getSports() {
            var resUrl = "api/rizik/vrsta/1";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getAgeGroups() {
            var resUrl = "api/rizik/vrsta/2";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getLocations() {
            var resUrl = "api/rizik/vrsta/4";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getInsuranceAmounts() {
            var resUrl = "api/rizik/vrsta/5";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        return {
            getSports: getSports,
            getAgeGroups: getAgeGroups,
            getLocations: getLocations,
            getInsuranceAmounts: getInsuranceAmounts
        };


    }


})();