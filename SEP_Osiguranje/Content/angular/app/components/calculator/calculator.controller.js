(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    function calculatorController() {
        var cc = this;
        cc.testPrice = "$2000";
    
        jQuery(function ($) {
            var transition_time = 1000;


            $('.user-toggle').click(function () {
                var formTable = $(this).parent().next();
                var markHide = $(this).find(".user-hide");
                var markShow = $(this).find(".user-show");
                formTable.slideToggle(transition_time);
                markHide.toggle();
                markShow.toggle();
            });
        });
    }
})();