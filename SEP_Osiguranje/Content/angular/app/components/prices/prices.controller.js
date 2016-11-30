(function () {
    'use strict';

    angular
		.module('app')
		.controller('pricesController', pricesController);

    function pricesController() {
        var pc = this;
        pc.testPrice = "$2000";
    }


})();