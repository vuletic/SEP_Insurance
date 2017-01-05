(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    calculatorController.$inject = ['dataAccessService', 'calculatorService'];
    function calculatorController(dataAccessService, calculatorService) {
        var cc = this;

        cc.calculatedPrice = 956000;
        cc.showInsurance = true;
        cc.showObject = false;
        cc.showVehicle = false;

        cc.enableObject = false;
        cc.enableVehicle = false;

        cc.chooseSport = false;
        cc.chooseRepair = false;
        cc.chooseHotel = false;
        cc.temp1 = false;
        cc.temp2 = false;

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

        cc.calculate = function () {
            calculatorService.sendCalculateData(cc.data).then(function (response) {
                cc.calculatedPrice = response;
            });
        }


    }
})();