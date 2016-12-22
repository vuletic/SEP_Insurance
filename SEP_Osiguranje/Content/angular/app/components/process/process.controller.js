(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    function processController() {
        
        var selectedProcessPanel = [true, false, false, false, false];
        var showUserDetails = false;
        var hideObjectInsurance = false;
        var hideVehicleInsurance = false;

        var chooseSport = false;
        var chooseRepair = false;
        var chooseHotel = false;
        var temp1 = false;
        var temp2 = false;

        var insuranceCarrierIsNotInsured = false;
    }

})();