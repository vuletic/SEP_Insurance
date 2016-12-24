(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['processService'];
    function processController(processService) {
        
        var pr = this;

        pr.selectedProcessPanel = [true, false, false, false, false];
        pr.showUserDetails = false;
        pr.hideObjectInsurance = false;
        pr.hideVehicleInsurance = false;

        pr.insuranceCarrierIsNotInsured = false;

        var chooseSport = false;    // refaktorisati var u pr. !!!
        var chooseRepair = false;
        var chooseHotel = false;
        var temp1 = false;
        var temp2 = false;

        processService.getSports().then(function (response) {
            pr.sports = response;
        });

        processService.getAgeGroups().then(function (response) {
            pr.ageGroups = response;
        });

        processService.getLocations().then(function (response) {
            pr.locations = response;
        });

        processService.getInsuranceAmounts().then(function (response) {
            pr.insuranceAmounts = response;
        });
        
    }

})();