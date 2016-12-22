(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['$timeout'];
    function processController($timeout) {
        
        var pr = this;

        pr.selectedProcessPanel = [true, false, false, false, false];
        pr.hideUserDetails = false;
        pr.hideObjectInsurance = false;
        pr.hideVehicleInsurance = false;

        pr.insuranceCarrierIsNotInsured = false;

        //$timeout(function () { pr.selectedProcessPanel[0] = true; }, 10);

        var chooseSport = false;
        var chooseRepair = false;
        var chooseHotel = false;
        var temp1 = false;
        var temp2 = false;

        var insuranceCarrierIsNotInsured = false;
    }

})();