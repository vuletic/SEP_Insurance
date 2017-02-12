(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    calculatorController.$inject = ['dataAccessService', 'calculatorService', '$state'];
    function calculatorController(dataAccessService, calculatorService, $state) {
        var cc = this;

        cc.showInsurance = true;
        cc.showObject = false;
        cc.showVehicle = false;
        cc.priceIsCalculated = false;


        cc.calculatedPrice = 0;

        cc.data = {};
        cc.data.ageNumberYoung = 0;
        cc.data.ageNumberAdult = 0;
        cc.data.ageNumberOld = 0;
        cc.data.towing = false;
        cc.data.alternateTransport = false;
        cc.data.hotel = false;
        cc.data.repair = false;
        cc.data.sport = false;
        
        cc.showErrors = false;
        cc.countYoungTouchedValue = false;
        cc.countAdultTouchedValue = false;
        cc.countOldTouchedValue = false;
        cc.currentDate = new Date();
        cc.nextDate = new Date();
        cc.objectJustExpanded = true;

        cc.enableObject = false;
        cc.enableVehicle = false;

        dataAccessService.getSports().then(function (response) {
            cc.sports = response;
            cc.data.selectedSport = cc.sports[0].Id_Rizik;
        });

        dataAccessService.getAgeGroups().then(function (response) {
            cc.ageGroups = response;
        });

        dataAccessService.getLocations().then(function (response) {
            cc.locations = response;
            cc.data.selectedLocation = cc.locations[0].Id_Rizik;
        });

        dataAccessService.getInsuranceAmounts().then(function (response) {
            cc.insuranceAmounts = response;
            cc.data.selectedInsuranceAmount = cc.insuranceAmounts[0].Id_Rizik;
        });

        dataAccessService.getRealEstateAges().then(function (response) {
            cc.realEstateAges = response;
            cc.data.selectedRealEstateAge = cc.realEstateAges[0].Id_Rizik;
        });

        dataAccessService.getRealEstateValues().then(function (response) {
            cc.realEstateValues = response;
            cc.data.selectedRealEstateValue = cc.realEstateValues[0].Id_Rizik;
        });

        dataAccessService.getTowingDistances().then(function (response) {
            cc.towingDistances = response;
            cc.data.selectedTowingDistance = cc.towingDistances[0].Id_Rizik;
        });

        dataAccessService.getAlternateTransportationDistances().then(function (response) {
            cc.alternateTransportationDistances = response;
            cc.data.selectedAlternateTransportationDistance = cc.alternateTransportationDistances[0].Id_Rizik;
        });

        dataAccessService.getReparationPrices().then(function (response) {
            cc.reparationPrices = response;
            cc.data.selectedReparationPrice = cc.reparationPrices[0].Id_Rizik;
        });

        dataAccessService.getHotelDays().then(function (response) {
            cc.hotelDays = response;
            cc.data.selectedHotelDays = cc.hotelDays[0].Id_Rizik;
        });


        cc.calculate = function () {
            if (!cc.everythingIsValid()) {
                return;
            }
            cc.data.realEstateInsured = cc.enableObject;
            cc.data.carInsured = cc.enableVehicle;
            cc.priceIsCalculated = true;
            calculatorService.sendCalculateData(cc.data).then(function (response) {
                cc.calculatedPrice = response;
            });
            cc.calculatorForm.$setPristine();
        }

        cc.proceedToProcess = function () {
            cc.data.realEstateInsured = cc.enableObject;
            cc.data.carInsured = cc.enableVehicle;
            $state.go('core.process', { data: cc.data });
        }

        cc.everythingIsValid = function () {
            cc.checkPeopleCount();
            if (cc.enableObject) {
                cc.validateObjectOptions();
                cc.objectJustExpanded = false;
            }
            if (cc.enableVehicle)
                cc.validateVehicleOptions();
            if (!cc.calculatorForm.$valid) {
                cc.showErrors = true;
                if (!cc.calculatorForm.nameDateFrom.$valid || !cc.calculatorForm.nameDateTo.$valid || !cc.calculatorForm.nameCountYoung.$valid)
                    cc.showInsurance = true;
                if (cc.enableObject) {
                    if (!cc.calculatorForm.nameObjectFire.$valid || !cc.calculatorForm.nameObjectSize.$valid)
                        cc.showObject = true;
                }
                if (cc.enableVehicle) {
                    if (!cc.calculatorForm.nameVehicleTransport.$valid)
                        cc.showVehicle = true;
                }
                return false;
            } else {
                cc.showErrors = false;
                return true;
            }
        }

        cc.disableObjects = function () {
            cc.objectJustExpanded = true;
            cc.data.residenceSize = "";
            cc.data.residenceFromFlood = false;
            cc.data.residenceFromFire = false;
            cc.data.residenceFromTheft = false;
            cc.data.selectedRealEstateAge = cc.realEstateAges[0].Id_Rizik;
            cc.data.selectedRealEstateValue = cc.realEstateValues[0].Id_Rizik;
            cc.calculatorForm.nameObjectFlood.$setValidity("chooseObject", true);
            cc.calculatorForm.nameObjectFire.$setValidity("chooseObject", true);
            cc.calculatorForm.nameObjectTheft.$setValidity("chooseObject", true);
        }

        cc.disableVehicles = function () {
            cc.data.towing = false;
            cc.data.repair = false;
            cc.data.hotel = false;
            cc.data.alternateTransport = false;
            cc.data.selectedTowingDistance = cc.towingDistances[0].Id_Rizik;
            cc.data.selectedReparationPrice = cc.reparationPrices[0].Id_Rizik;
            cc.data.selectedHotelDays = cc.hotelDays[0].Id_Rizik;
            cc.data.selectedAlternateTransportationDistance = cc.alternateTransportationDistances[0].Id_Rizik;
            cc.calculatorForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
            cc.calculatorForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
            cc.calculatorForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
            cc.calculatorForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
        }

        cc.checkPeopleCount = function () {
            var sum = cc.data.ageNumberYoung + cc.data.ageNumberAdult + cc.data.ageNumberOld;
            if (sum <= 0) {
                cc.calculatorForm.nameCountYoung.$setValidity("sum", false);
                cc.calculatorForm.nameCountAdult.$setValidity("sum", false);
                cc.calculatorForm.nameCountOld.$setValidity("sum", false);
            } else {
                cc.calculatorForm.nameCountYoung.$setValidity("sum", true);
                cc.calculatorForm.nameCountAdult.$setValidity("sum", true);
                cc.calculatorForm.nameCountOld.$setValidity("sum", true);
            }
        }

        cc.peopleCountChanged = function () {
            if (cc.showErrors || (cc.countYoungTouchedValue && cc.countAdultTouchedValue && cc.countOldTouchedValue))
                cc.checkPeopleCount();
        }

        cc.countYoungTouched = function () {
            cc.countYoungTouchedValue = true;
            if (cc.countAdultTouchedValue && cc.countOldTouchedValue)
                cc.checkPeopleCount();
        }

        cc.countAdultTouched = function () {
            cc.countAdultTouchedValue = true;
            if (cc.countYoungTouchedValue && cc.countOldTouchedValue)
                cc.checkPeopleCount();
        }

        cc.countOldTouched = function () {
            cc.countOldTouchedValue = true;
            if (cc.countYoungTouchedValue && cc.countAdultTouchedValue)
                cc.checkPeopleCount();
        }

        cc.changeStartDate = function () {
            cc.nextDate.setDate(cc.data.dateFrom.getDate() + 1);
        }

        cc.objectRequiredShow = function () {
            return cc.showErrors && !cc.objectJustExpanded;
        }

        cc.validateObjectOptions = function () {
            if (!cc.data.residenceFromFlood && !cc.data.residenceFromFire && !cc.data.residenceFromTheft) {
                if (cc.enableObject) {
                    cc.calculatorForm.nameObjectFlood.$setValidity("chooseObject", false);
                    cc.calculatorForm.nameObjectFire.$setValidity("chooseObject", false);
                    cc.calculatorForm.nameObjectTheft.$setValidity("chooseObject", false);
                }
            } else {
                if (cc.enableObject) {
                    cc.calculatorForm.nameObjectFlood.$setValidity("chooseObject", true);
                    cc.calculatorForm.nameObjectFire.$setValidity("chooseObject", true);
                    cc.calculatorForm.nameObjectTheft.$setValidity("chooseObject", true);
                }
            }
        }

        cc.validateVehicleOptions = function () {
            if (!cc.data.alternateTransport && !cc.data.hotel && !cc.data.repair && !cc.data.towing) {
                if (cc.enableVehicle) {
                    cc.calculatorForm.nameVehicleTowing.$setValidity("chooseVehicle", false);
                    cc.calculatorForm.nameVehicleRepair.$setValidity("chooseVehicle", false);
                    cc.calculatorForm.nameVehicleHotel.$setValidity("chooseVehicle", false);
                    cc.calculatorForm.nameVehicleTransport.$setValidity("chooseVehicle", false);
                }
            } else {
                if (cc.enableVehicle) {
                    cc.calculatorForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
                    cc.calculatorForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
                    cc.calculatorForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
                    cc.calculatorForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
                }
            }
        }
    }
})();