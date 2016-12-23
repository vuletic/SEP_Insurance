(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    calculatorController.$inject = ['calculatorService'];
    function calculatorController(calculatorService) {
        var cc = this;

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

        calculatorService.getSports().then(function(response){
            cc.sports = response;
        });

        calculatorService.getAgeGroups().then(function (response) {
            cc.ageGroups = response;
        });

        calculatorService.getLocations().then(function (response) {
            cc.locations = response;
        });

        calculatorService.getInsuranceAmounts().then(function (response) {
            cc.insuranceAmounts = response;
        });

    }
})();