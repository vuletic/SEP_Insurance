(function () {
    'use strict';

    angular
		.module('app')
		.controller('coreController', coreController);

    coreService.$inject = ['localization'];
    function coreController(localization) {
        var cr = this;
        cr.l10nObj = "maau";
        cr.neu = "mau";

        cr.localize = function (language) {
            localization.getLocalizationObj(language).then(function (response) {
                cr.l10nObj = response;

            });
        };

        /*localization.getLocalizationObj("srpski").then(function(response){
            cr.l10nObj = response;

        });*/

        cr.localize("srpski");
    }


})();