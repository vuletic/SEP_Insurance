(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    function processController() {
        
        var selectedProcessPanel = [true, false, false, false, false];
        var hideUserDetails = false;
        var hideObjectInsurance = false;
        var hideVehicleInsurance = false;

        var insuranceCarrierIsNotInsured = false;
    }

})();