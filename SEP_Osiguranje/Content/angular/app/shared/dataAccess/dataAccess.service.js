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

        function getRealEstateAges() {
            var resUrl = "api/rizik/vrsta/7";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getRealEstateValues() {
            var resUrl = "api/rizik/vrsta/12";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getTowingDistances() {
            var resUrl = "api/rizik/vrsta/13";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getReparationPrices() {
            var resUrl = "api/rizik/vrsta/14";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getAlternateTransportationDistances() {
            var resUrl = "api/rizik/vrsta/15";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getHotelDays() {
            var resUrl = "api/rizik/vrsta/16";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        } 
        
        function getRisk(id) {
            var resUrl = "api/rizik/id/" + id;
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getRisk(id) {
            var resUrl = "api/rizik/" + id;
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        return {
            getSports: getSports,
            getAgeGroups: getAgeGroups,
            getLocations: getLocations,
            getInsuranceAmounts: getInsuranceAmounts,
            getRealEstateAges: getRealEstateAges,
            getRealEstateValues: getRealEstateValues,
            getTowingDistances: getTowingDistances,
            getReparationPrices: getReparationPrices,
            getAlternateTransportationDistances: getAlternateTransportationDistances,
            getHotelDays: getHotelDays,
            getRisk: getRisk
        };


    }


})();