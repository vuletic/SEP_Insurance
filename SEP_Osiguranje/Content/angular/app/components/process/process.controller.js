(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['dataAccessService', '$stateParams'];
    function processController(dataAccessService, $stateParams) {
        
        
        var pr = this;

        if ($stateParams.data != null)
            pr.data = $stateParams.data;

        pr.selectedProcessPanel = [true, false, false, false, false];
        pr.showUserDetails = false;
        pr.hideObjectInsurance = false;
        pr.hideVehicleInsurance = false;

        pr.insuranceCarrierIsNotInsured = false;

        /* Razmisliti o slanju podataka. Podaci za racunanje idu rules aplikaciji (pr.data!!!),
           a ostali mozda bolje odmah u web api. Mozda sve zajedno ipak?
        */

        var chooseSport = false;    // refaktorisati var u pr. !!!
        var chooseRepair = false;
        var chooseHotel = false;
        var temp1 = false;
        var temp2 = false;

        dataAccessService.getSports().then(function (response) {
            pr.sports = response;
        });

        dataAccessService.getAgeGroups().then(function (response) {
            pr.ageGroups = response;
        });

        dataAccessService.getLocations().then(function (response) {
            pr.locations = response;
        });

        dataAccessService.getInsuranceAmounts().then(function (response) {
            pr.insuranceAmounts = response;
        });
        
    }

})();