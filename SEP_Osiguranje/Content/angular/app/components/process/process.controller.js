(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['dataAccessService', 'processService', '$stateParams'];
    function processController(dataAccessService, processService, $stateParams) {

        var pr = this;
        pr.jmbgRegex = /^(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((9|\d)\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((9|\d)\d{2}))|((0[1-9]|1\d|2[0-8])02((9|\d)\d{2}))|(2902(([6-9]|\d)(0[48]|[2468][048]|[13579][26])|((6|[048]|[26])00))))([0-8][0-9]|9[0-6])([0-9]{3})(\d)$/;

        pr.data = {};

        pr.showObjectInsurance = false;
        pr.showVehicleInsurance = false;

        pr.data.ageNumberYoung = 0;
        pr.data.ageNumberAdult = 0;
        pr.data.ageNumberOld = 0;
        pr.data.towing = false;
        pr.alternateTransport = false;
        pr.data.hotel = false;
        pr.data.repair = false;
        pr.data.sport = false;

        if ($stateParams.data != null) {
            pr.data = $stateParams.data;
            pr.showObjectInsurance = pr.data.realEstateInsured;
            pr.showVehicleInsurance = pr.data.carInsured;
        } else
            pr.data = {};

        pr.data.customers = [];
        pr.data.customersFilter = [];
        pr.data.bearer = null;
        pr.data.vehicle;
        pr.data.obj = null;

        pr.finishProcess = function () {
            if (!pr.everythingIsValidFinal())
                return;

            var dto = {};

            dto.dateFrom = pr.data.dateFrom;
            dto.dateTo = pr.data.dateTo;
            dto.location = pr.data.selectedLocation;
            dto.insuranceAmount = pr.data.selectedInsuranceAmount;

            if (pr.data.sport)
                dto.selectedSport = pr.data.selectedSport;
            else
                dto.selectedSport = -1;

            dto.customers = [];

            for (var i = 0; i < pr.data.customers.length; i++) {
                var currCustomer = pr.data.customers[i];
                var tempCustomer = {};
                tempCustomer.osoba = {};

                tempCustomer.osoba.JMBG_Osoba = currCustomer.jmbg;
                tempCustomer.osoba.Ime_Osoba = currCustomer.name;
                tempCustomer.osoba.Prezime_Osoba = currCustomer.surname;
                tempCustomer.osoba.Broj_pasosa_Osoba = currCustomer.passport;
                tempCustomer.osoba.Adresa_Osoba = currCustomer.street + " " + currCustomer.addresNum + ", " + currCustomer.city;

                if (currCustomer.phoneNum)
                    tempCustomer.osoba.Broj_telefona_Osoba = currCustomer.phoneNum;

                tempCustomer.ageGroup = currCustomer.ageGroup;

                tempCustomer.insured = true;
                tempCustomer.carrier = false;

                dto.customers.push(tempCustomer);
            }

            if (pr.insuranceCarrierIsNotInsured) {

                var tempCustomer = {};
                tempCustomer.osoba = {};

                tempCustomer.osoba.JMBG_Osoba = pr.data.insCarrierNI.jmbg;
                tempCustomer.osoba.Ime_Osoba = pr.data.insCarrierNI.name;
                tempCustomer.osoba.Prezime_Osoba = pr.data.insCarrierNI.surname;
                tempCustomer.osoba.Adresa_Osoba = pr.data.insCarrierNI.address.street + " " + pr.data.insCarrierNI.address.number + ", " + pr.data.insCarrierNI.address.city;
                tempCustomer.osoba.Broj_telefona_Osoba = pr.data.insCarrierNI.phoneNum;
                tempCustomer.osoba.E_mail_Osoba = pr.data.insCarrierNI.email;

                tempCustomer.ageGroup = -1;

                tempCustomer.insured = false;
                tempCustomer.carrier = true;

                dto.customers.push(tempCustomer);
            } else {
                var index = pr.data.insCarrierI;
                dto.customers[index].osoba.E_mail_Osoba = pr.tempEmail;
                dto.customers[index].carrier = true;
            }

            if (pr.data.object != null) {
                dto.objectData = {};
                dto.objectData.obj = {};

                dto.objectData.obj.Id_Osigurani_entitet = -1;
                dto.objectData.obj.JMBG_vlasnik_Nekretnina = pr.data.object.owner.jmbg;
                dto.objectData.obj.Adresa_Nekretnina = pr.data.object.address.street + " " + pr.data.object.address.number + ", " + pr.data.object.address.city;
                dto.objectData.obj.Ime_vlasnik_Nekretnina = pr.data.object.owner.name;
                dto.objectData.obj.Prezime_vlasnik_Nekretnina = pr.data.object.owner.surname;
                dto.objectData.obj.Povrsina_Nekretnina = pr.data.residenceSize;

                dto.objectData.age = pr.data.selectedRealEstateAge;
                dto.objectData.value = pr.data.selectedRealEstateValue;

                if (pr.data.residenceFromFlood) {
                    dto.objectData.flood = true;
                } else
                    dto.objectData.flood = false;

                if (pr.data.residenceFromFire) {
                    dto.objectData.fire = true;
                } else
                    dto.objectData.fire = false;

                if (pr.data.residenceFromTheft) {
                    dto.objectData.theft = true;
                } else
                    dto.objectData.theft = false;

            } else {
                dto.objectData = null;
            }

            if (pr.data.vehicle) {
                dto.vehicleData = {};
                dto.vehicleData.vehicle = {};

                dto.vehicleData.vehicle.Id_Osigurani_entitet = -1;
                dto.vehicleData.vehicle.JMBG_Vlasnik_Vozilo = pr.data.vehicle.customer.jmbg;
                dto.vehicleData.vehicle.Ime_Vlasnik_Vozilo = pr.data.vehicle.customer.name;
                dto.vehicleData.vehicle.Prezime_Vlasnik_Vozilo = pr.data.vehicle.customer.surname;
                dto.vehicleData.vehicle.Broj_sasije_Vozilo = pr.data.vehicle.chassisNumber;
                dto.vehicleData.vehicle.Broj_registarske_tablice_Vozilo = pr.data.vehicle.registrationNumber;
                dto.vehicleData.vehicle.Godina_proizvodnje_Vozilo = pr.data.vehicle.productionYear;

                if (pr.data.towing)
                    dto.vehicleData.tow = pr.data.selectedTowingDistance;
                else
                    dto.vehicleData.tow = -1;

                if (pr.data.repair)
                    dto.vehicleData.repair = pr.data.selectedReparationPrice;
                else
                    dto.vehicleData.repair = -1;

                if (pr.data.hotel)
                    dto.vehicleData.accom = pr.data.selectedHotelDays;
                else
                    dto.vehicleData.accom = -1;

                if (pr.data.alternateTransport)
                    dto.vehicleData.ride = pr.data.selectedAlternateTransportationDistance;
                else
                    dto.vehicleData.ride = -1;
            }

            console.log(dto);
            processService.finalizeProcess(dto).then(function (response) {
                console.log(response);//TODO Prebaci se na preview
            });

        }

        pr.selectedProcessPanel = [true, false, false, false, false];
        pr.insuranceCarrierIsNotInsured = false;


        dataAccessService.getSports().then(function (response) {
            pr.sports = response;
            pr.data.selectedSport = pr.sports[0].Id_Rizik;
        });

        dataAccessService.getAgeGroups().then(function (response) {
            pr.ageGroups = response;
        });

        dataAccessService.getLocations().then(function (response) {
            pr.locations = response;
            pr.data.selectedLocation = pr.locations[0].Id_Rizik;
        });

        dataAccessService.getInsuranceAmounts().then(function (response) {
            pr.insuranceAmounts = response;
            pr.data.selectedInsuranceAmount = pr.insuranceAmounts[0].Id_Rizik;
        });

        dataAccessService.getRealEstateAges().then(function (response) {
            pr.realEstateAges = response;
            pr.data.selectedRealEstateAge = pr.realEstateAges[0].Id_Rizik;
        });

        dataAccessService.getRealEstateValues().then(function (response) {
            pr.realEstateValues = response;
            pr.data.selectedRealEstateValue = pr.realEstateValues[0].Id_Rizik;
        });

        dataAccessService.getTowingDistances().then(function (response) {
            pr.towingDistances = response;
            pr.data.selectedTowingDistance = pr.towingDistances[0].Id_Rizik;
        });

        dataAccessService.getAlternateTransportationDistances().then(function (response) {
            pr.alternateTransportationDistances = response;
            pr.data.selectedAlternateTransportationDistance = pr.alternateTransportationDistances[0].Id_Rizik;
        });

        dataAccessService.getReparationPrices().then(function (response) {
            pr.reparationPrices = response;
            pr.data.selectedReparationPrice = pr.reparationPrices[0].Id_Rizik;
        });

        dataAccessService.getHotelDays().then(function (response) {
            pr.hotelDays = response;
            pr.data.selectedHotelDays = pr.hotelDays[0].Id_Rizik;
        });

        /******         COMMON VALIDATION           ******/
        pr.validAge = function (jmbgValue) {
            if (jmbgValue.length != 13)
                return false;

            var day = parseInt(jmbgValue.substring(0, 2));
            var month = parseInt(jmbgValue.substring(2, 4)) - 1;
            var yearString = (jmbgValue[4] == 0 ? '2' : '1') + jmbgValue.substring(4, 7)
            var year = parseInt(yearString) + 18;

            var validDate = new Date(year, month, day);
            var currentDate = new Date();

            if (currentDate.getTime() < validDate.getTime()){
                return false;
            }

            return true;
        }

        /******         FIRST PAGE VALIDATION       ******/
        pr.currentDate = new Date();
        pr.nextDate = new Date();
        pr.showErrorsFirst = false;

        pr.changeStartDate = function () {
            pr.nextDate.setDate(pr.data.dateFrom.getDate() + 1);
        }

        pr.goFromFirstPage = function () {
            if (!pr.everythingIsValidFirst()) {
                return;
            }
            pr.selectedProcessPanel = [false, true, false, false, false];
        }

        pr.everythingIsValidFirst = function () {
            if (!pr.firstPageForm.$valid) {
                pr.showErrorsFirst = true;
                return false;
            } else {
                pr.showErrorsFirst = false;
                return true;
            }
        }

        /******         SECCOND PAGE VALIDATION       ******/
        pr.showErrorsSecond = false;

        pr.goFromSecondPage = function () {
            if (!pr.everythingIsValidSecond()) {
                return;
            }
            pr.selectedProcessPanel = [false, false, true, false, false];
        }

        pr.everythingIsValidSecond = function () {
            if (pr.data == undefined || pr.data.customers == undefined) {
                pr.showErrorsSecond = true;
                return false;
            }
            if (pr.data.customers.length == 0) {
                pr.showErrorsSecond = true;
                return false;
            } else {
                pr.showErrorsSecond = false;
                return true;
            }
        }

        /******         THIRD PAGE VALIDATION       ******/
        pr.showErrorsThird = false;

        pr.goFromThirdPage = function () {
            if (pr.showObjectInsurance) {
                if (!pr.everythingIsValidThird()) {
                    return;
                }
            }
            pr.selectedProcessPanel = [false, false, false, true, false];
        }

        pr.everythingIsValidThird = function () {
            if (pr.showObjectInsurance) {
                pr.validateObjectOptions();
                pr.validateObjectJmbg();
            }
            if (!pr.thirdPageForm.$valid) {
                pr.showErrorsThird = true;
                return false;
            } else {
                pr.showErrorsThird = false;
                return true;
            }
        }

        pr.validateObjectJmbg = function () {
        
            if (pr.data.object == undefined || pr.data.object.owner == undefined || pr.data.object.owner.jmbg == undefined)
                return;
            if (!pr.validAge(pr.data.object.owner.jmbg)) {
                pr.thirdPageForm.nameObjectJmbg.$setValidity("jmbg", false);
            } else {
                pr.thirdPageForm.nameObjectJmbg.$setValidity("jmbg", true);
            }
        }

        pr.validateObjectOptions = function () {
            if (!pr.data.residenceFromFlood && !pr.data.residenceFromFire && !pr.data.residenceFromTheft) {
                pr.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", false);
                pr.thirdPageForm.nameObjectFire.$setValidity("chooseObject", false);
                pr.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", false);
            } else {
                pr.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", true);
                pr.thirdPageForm.nameObjectFire.$setValidity("chooseObject", true);
                pr.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", true);
            }
        }

        pr.disableObjects = function () {
            pr.showErrorsThird = false;
            pr.data.residenceFromFlood = false;
            pr.data.residenceFromFire = false;
            pr.data.residenceFromTheft = false;
            pr.data.selectedRealEstateAge = pr.realEstateAges[0].Id_Rizik;
            pr.data.selectedRealEstateValue = pr.realEstateValues[0].Id_Rizik;
            pr.data.residenceSize = "";
            pr.data.object = {};
            pr.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", true);
            pr.thirdPageForm.nameObjectFire.$setValidity("chooseObject", true);
            pr.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", true);
            pr.thirdPageForm.nameObjectJmbg.$setValidity("validJmbg", true);
        }

        /******         FOURTH PAGE VALIDATION       ******/
        pr.showErrorsFourth = false;
        pr.chooseCarrierDisabled = false;
        pr.currentYear = (new Date()).getFullYear();

        pr.goFromFourthPage = function () {
            pr.filterForCarriers();
            if (pr.showVehicleInsurance) {
                if (!pr.everythingIsValidFourth()) {
                    return;
                }
            }
            pr.selectedProcessPanel = [false, false, false, false, true];
        }

        pr.everythingIsValidFourth = function () {
            if (pr.showVehicleInsurance) {
                pr.validateVehicleOptions();
                pr.validateVehicleJmbg();
            }
            if (!pr.fourthPageForm.$valid) {
                pr.showErrorsFourth = true;
                return false;
            } else {
                pr.showErrorsFourth = false;
                return true;
            }
        }

        pr.validateVehicleJmbg = function () {
            if (pr.data.vehicle == undefined || pr.data.vehicle.customer == undefined || pr.data.vehicle.customer.jmbg == undefined)
                return;
            if (!pr.validAge(pr.data.vehicle.customer.jmbg)) {
                pr.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", false);
            } else {
                pr.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", true);
            }
        }

        pr.validateVehicleOptions = function () {
            if (!pr.data.alternateTransport && !pr.data.hotel && !pr.data.repair && !pr.data.towing) {
                pr.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", false);
                pr.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", false);
                pr.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", false);
                pr.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", false);
            } else {
                pr.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
                pr.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
                pr.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
                pr.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
            }
        }

        pr.disableVehicles = function () {
            pr.showErrorsFourth = false;
            pr.data.towing = false;
            pr.data.repair = false;
            pr.data.hotel = false;
            pr.data.alternateTransport = false;
            pr.data.selectedTowingDistance = pr.towingDistances[0].Id_Rizik;
            pr.data.selectedAlternateTransportationDistance = pr.alternateTransportationDistances[0].Id_Rizik;
            pr.data.selectedReparationPrice = pr.reparationPrices[0].Id_Rizik;
            pr.data.selectedHotelDays = pr.hotelDays[0].Id_Rizik;
            pr.data.towing = false;
            pr.data.repair = false;
            pr.data.hotel = false;
            pr.data.alternateTransport = false;
            pr.data.vehicle = {};
            pr.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", true);
            pr.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
            pr.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
            pr.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
            pr.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
        }

        pr.filterForCarriers = function () {
            pr.data.customersFilter = pr.data.customers.filter(function (customer) {
                return customer.category != "0";
            });
            if (pr.data.customersFilter.length == 0) {
                pr.insuranceCarrierIsNotInsured = true;
                pr.chooseCarrierDisabled = true;
            } else {
                pr.chooseCarrierDisabled = false;
                pr.data.insCarrierI = "0";
            }
        }

        /******         FINAL PAGE VALIDATION       ******/
        pr.showErrorsFinal = false;
        pr.tempEmail = "";

        pr.everythingIsValidFinal = function () {
            pr.validateCarrierJmbg();
            if (!pr.finalPageForm.$valid) {
                pr.showErrorsFinal = true;
                return false;
            } else {
                pr.showErrorsFinal = false;
                return true;
            }
        }

        pr.validateCarrierJmbg = function () {
            if (pr.data.insCarrierNI == undefined)
                return;
            if (pr.data.insCarrierNI.jmbg == undefined)
                return;
            if (!pr.validAge(pr.data.insCarrierNI.jmbg)) {
                pr.finalPageForm.nameJmbgNew.$setValidity("jmbg", false);
            } else {
                pr.finalPageForm.nameJmbgNew.$setValidity("jmbg", true);
            }
        }

        pr.switchCarrier = function () {
            pr.showErrorsFinal = false;

            if (!pr.insuranceCarrierIsNotInsured) {
                pr.finalPageForm.nameJmbgNew.$setValidity("jmbg", true);
                pr.finalPageForm.nameNameNew.$setUntouched();
                pr.finalPageForm.nameSurnameNew.$setUntouched();
                pr.finalPageForm.nameJmbgNew.$setUntouched();
                pr.finalPageForm.nameStreetNew.$setUntouched();
                pr.finalPageForm.nameNumberNew.$setUntouched();
                pr.finalPageForm.nameCityNew.$setUntouched();
                pr.finalPageForm.namePhoneNew.$setUntouched();
                pr.finalPageForm.nameEmailNew.$setUntouched();
                pr.data.insCarrierNI = {};
            } else {
                pr.tempEmail = "";
                pr.data.insCarrierI = "0";
                pr.finalPageForm.nameEmailIncluded.$setUntouched();
            }
        }
    }
})();