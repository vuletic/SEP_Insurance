(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    calculatorController.$inject = ['calculatorService'];
    function calculatorController(calculatorService) {
        var cc = this;

        var showInsurance = true;
        var showObject = false;
        var showVehicle = false;

        var enableObject = false;
        var enableVehicle = false;

        var chooseSport = false;
        var chooseRepair = false;
        var chooseHotel = false;
        var temp1 = false;
        var temp2 = false;

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