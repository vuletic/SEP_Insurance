(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    function processController() {
        
        jQuery(function ($) {
            var transition_time = 1000;

            $('.navigation-back').click(function () {
                var panel = $(this).parents(".float-control");
                var current = $(this).parents(".main-content");
                var prev = current.prev();

                current.fadeOut(transition_time);
                prev.fadeIn(transition_time);
                panel.animate({
                    left: "+=720",
                }, transition_time, function () {
                    $("html, body").animate({ scrollTop: 220 }, 400);
                });
            });

            $('.navigation-forth').on('click', function () {
                var panel = $(this).parents(".float-control");
                var current = $(this).parents(".main-content");
                var next = current.next();

                next.fadeOut(transition_time);
                next.fadeIn(transition_time);
                panel.animate({
                    left: "-=720",
                }, transition_time, function () {
                    $("html, body").animate({ scrollTop: 220 }, 400);
                });
            });

            $('.open-form').click(function () {
                var formm = $(this).parent().next();
                formm.slideDown(transition_time);
            });

            $('.close-form').click(function () {
                var formm = $(this).parent().next();
                formm.slideUp(transition_time);
            });

            $('.user-toggle').click(function () {
                var formTable = $(this).next();
                var markHide = $(this).find(".user-hide");
                var markShow = $(this).find(".user-show");
                formTable.slideToggle(transition_time);
                markHide.toggle();
                markShow.toggle();
            });
        });

    }


})();