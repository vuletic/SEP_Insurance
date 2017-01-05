(function () {
    'use strict';

    angular
		.module('app')
		.controller('coreController', coreController);

    coreController.$inject = ['localization', '$window'];
    function coreController(localization, $window) {
        var cr = this;

        cr.localize = function (language) {
            localization.getLocalizationObj(language).then(function (response) {
                cr.l10nObj = response;
                if (cr.l10nObj.lng == 'english') {
                    cr.lang = 1;
                } else {
                    cr.lang = 0;
                }
            });
        };

        cr.scroll = function () {
            $window.scrollTo(0, 240);
        };

        cr.localize("srpski");
   
    }


})();