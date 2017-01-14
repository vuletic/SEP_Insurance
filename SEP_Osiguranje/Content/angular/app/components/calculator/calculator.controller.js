(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    calculatorController.$inject = ['dataAccessService', 'calculatorService', '$state'];
    function calculatorController(dataAccessService, calculatorService, $state) {
        var cc = this;

        cc.data = {};

        cc.calculatedPrice = 0;

        cc.data.ageNumberYoung = 0;
        cc.data.ageNumberAdult = 0;
        cc.data.ageNumberOld = 0;
        cc.showInsurance = true;
        cc.showObject = false;
        cc.showVehicle = false;

        cc.enableObject = false;
        cc.enableVehicle = false;


        dataAccessService.getSports().then(function (response) {
            cc.sports = response;
        });

        dataAccessService.getAgeGroups().then(function (response) {
            cc.ageGroups = response;
        });

        dataAccessService.getLocations().then(function (response) {
            cc.locations = response;
        });

        dataAccessService.getInsuranceAmounts().then(function (response) {
            cc.insuranceAmounts = response;
        });

        dataAccessService.getRealEstateAges().then(function (response) {
            cc.realEstateAges = response;
        });

        dataAccessService.getRealEstateValues().then(function (response) {
            cc.realEstateValues = response;
        });

        dataAccessService.getTowingDistances().then(function (response) {
            cc.towingDistances = response;
        });

        dataAccessService.getAlternateTransportationDistances().then(function (response) {
            cc.alternateTransportationDistances = response;
        });

        dataAccessService.getReparationPrices().then(function (response) {
            cc.reparationPrices = response;
        });

        dataAccessService.getHotelDays().then(function (response) {
            cc.hotelDays = response;
        });


        cc.calculate = function () {
            calculatorService.sendCalculateData(cc.data).then(function (response) {
                cc.calculatedPrice = response;
            });
        }

        cc.proceedToProcess = function () {
            $state.go('core.process', { data: cc.data });
        }
    }
})();