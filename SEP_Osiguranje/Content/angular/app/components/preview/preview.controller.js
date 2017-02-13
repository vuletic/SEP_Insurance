(function () {
    'use strict';

    angular
		.module('app')
		.controller('previewController', previewController);

    previewController.$inject = ['dataAccessService', '$stateParams', '$state', '$sce', '$window'];
    function previewController(dataAccessService, $stateParams, $state, $sce, $window) {

        var pc = this;
        
        if ($stateParams.data == null || $stateParams.info == null) {
            $state.go('core.home');
            return;
        }

        pc.data = {};
        pc.info = {};
        pc.dateFrom = "";
        pc.dateTo = "";
        pc.customers = {};
        pc.carrier = {};
        pc.object = {};
        pc.vehicle = {};

        pc.showObject = false;
        pc.showVehicle = false;

        pc.data = $stateParams.data;
        pc.info = $stateParams.info;

        var dateFromTemp = new Date(pc.data.ro.Datum_od);
        var dateToTemp = new Date(pc.data.ro.Datum_do);

        pc.dateFrom = dateFromTemp.getDate() + "." + (dateFromTemp.getMonth() + 1) + "." + dateFromTemp.getFullYear() + ".";
        pc.dateTo = dateToTemp.getDate() + "." + (dateToTemp.getMonth() + 1) + "." + dateToTemp.getFullYear() + ".";

        pc.customers = pc.info.customers.filter(function (customer) {
            return customer != null && customer.passport != null;
        });

        pc.carrier = pc.data.ro.Stavka_u_realizaciji.filter(function (customer) {
            return customer.Nosilac_Stavka_u_realiziciji == true && customer.Osoba != null;
        });
        pc.carrier = pc.carrier[0].Osoba;

        pc.object = pc.data.ro.Stavka_u_realizaciji.filter(function (object) {
            return object.Nekretnina != null;
        });
        if (pc.object.length != 0) {
            pc.object = pc.object[0].Nekretnina;
            pc.showObject = true;
        }

        pc.vehicle = pc.data.ro.Stavka_u_realizaciji.filter(function (vehicle) {
            return vehicle.Vozilo != null;
        });
        if (pc.vehicle.length != 0) {
            pc.vehicle = pc.vehicle[0].Vozilo;
            pc.showVehicle = true;
        }
        
        pc.trustDangerousSnippet = function () {
            return $sce.trustAsHtml(pc.data.pp_button);
        };

        $window.scrollTo(0, 220);

        pc.change = function () {
            pc.info.realEstateInsured = pc.showObject;
            pc.info.carInsured = pc.showVehicle;
            pc.info.enableSport = pc.info.sport;
            $state.go('core.process', { data: pc.info });
            return;
        }

        pc.cancel = function () {
            $state.go('core.home');
            return;
        }

        dataAccessService.getAgeGroups().then(function (response) {
            pc.ageGroups = response;
            pc.ageGroup0 = pc.ageGroups[0].Id_Rizik;
            pc.ageGroup1 = pc.ageGroups[1].Id_Rizik;
            pc.ageGroup2 = pc.ageGroups[2].Id_Rizik;
        });

        dataAccessService.getRisk(pc.info.selectedLocation).then(function (response) {
            pc.location = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedInsuranceAmount).then(function (response) {
            pc.ammount = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedSport).then(function (response) {
            pc.sport = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedRealEstateAge).then(function (response) {
            pc.objectAge = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedRealEstateValue).then(function (response) {
            pc.objectValue = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedTowingDistance).then(function (response) {
            pc.vehicleTowing = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedReparationPrice).then(function (response) {
            pc.vehicleRepair = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedHotelDays).then(function (response) {
            pc.veicleHotel = response[0];
        });

        dataAccessService.getRisk(pc.info.selectedAlternateTransportationDistance).then(function (response) {
            pc.vehicleAlternative = response[0];
        });
    }
})();