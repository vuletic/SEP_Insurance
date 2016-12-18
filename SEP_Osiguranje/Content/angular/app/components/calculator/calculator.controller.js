(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    function calculatorController() {
        var cc = this;
        cc.testPrice = "$2000";

        var hideInsurance = false;
        var hideInsuree = false;
        var showObject = false;
        var showVehicle = false;

        var enableObject = false;
        var enableVehicle = false;

    }
})();