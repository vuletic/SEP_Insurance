(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    function calculatorController() {
        var cc = this;
        cc.testPrice = "$2000";
    }


})();