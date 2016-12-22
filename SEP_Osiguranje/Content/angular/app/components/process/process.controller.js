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

    }

})();