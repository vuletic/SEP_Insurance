(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['$scope', 'dataAccessService', 'processService', '$stateParams'];
    function processController($scope, dataAccessService, processService, $stateParams) {        
        
        var pr = this;
        pr.jmbgRegex = /^(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((9|\d)\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((9|\d)\d{2}))|((0[1-9]|1\d|2[0-8])02((9|\d)\d{2}))|(2902(([6-9]|\d)(0[48]|[2468][048]|[13579][26])|((6|[048]|[26])00))))([0-8][0-9]|9[0-6])([0-9]{3})(\d)$/;

        pr.data = {};

        pr.hideObjectInsurance = false;
        pr.hideVehicleInsurance = false;

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
            pr.hideObjectInsurance = pr.data.realEstateInsured;
            pr.hideVehicleInsurance = pr.data.carInsured;
        } else
            pr.data = {};

        pr.data.customers = [];
        pr.data.bearer = null;
        pr.data.vehicle;
        pr.data.obj = null;

        pr.selected = -1;
        pr.selectCustomer = function(index){
            if (pr.selected != -1)
                pr.data.customers[pr.selected].cssClass = "not_selected";

            pr.data.customers[index].cssClass = "selected";
            pr.selected = index;

        }

        pr.commit = function () {
            var temp = JSON.parse(JSON.stringify(pr.tempCustomer));
            temp.ageGroup = pr.ageGroups[temp.category].Id_Rizik;

            if (!pr.editProcess) {
                temp.cssClass = "not_selected";
                pr.data.customers.push(temp);
            } else {
                pr.data.customers.splice(pr.selected, 1, temp);
                pr.editProcess = false;
            }

            pr.tempCustomer = {};
            pr.showUserDetails = false;
        };

        pr.addCustomer = function () {
            if (pr.selected != -1) {
                pr.data.customers[pr.selected].cssClass = "not_selected";
                pr.selected = -1;
            }
            pr.showUserDetails = true;
        }

        pr.deleteCustomer = function () {
            if (pr.selected == -1)
                return;

            pr.data.customers.splice(pr.selected, 1);
            pr.selected = -1;
        }

        pr.editProcess = false;
        pr.editCustomer = function () {
            if (pr.selected == -1)
                return;
            pr.editProcess = true;
            var temp = pr.data.customers[pr.selected];
            pr.tempCustomer = JSON.parse(JSON.stringify(temp));
            pr.showUserDetails = true;
        }

        pr.finishProcess = function () {
            if (!pr.everythingIsValidFinal())
                return;

            if (pr.insuranceCarrierIsNotInsured) {
                pr.data.customers[pr.data.insCarrierI].phoneNum = pr.tempPhoneNum;
                pr.data.customers[pr.data.insCarrierI].email = pr.tempEmail;
            }

            console.log(pr.data);
            
            var dto = {};            

            
            dto.dateFrom = pr.data.dateFrom;
            dto.dateTo = pr.data.dateTo;

            //Ovo bi trebalo da ima Id rizika.
            dto.location = pr.data.selectedLocation;
            dto.insuranceAmount = pr.data.selectedInsuranceAmount;

            if (pr.data.selectedSport != null && pr.data.selectedSport != undefined)
                dto.selectedSport = pr.data.selectedSport;
            else
                dto.selectedSport = -1;


            dto.customers = [];

            //Dodavanje musterija, pretvaranje u prenosiv oblik, razumljiv backendu. Kad imao vremena, eliminisi ovaj deo tako sto se automatski ovako popunjava. Barem obavezne vrednosti!
            for (var i = 0; i < pr.data.customers.length; i++) {
                var currCustomer = pr.data.customers[i];
                var tempCustomer = {};
                tempCustomer.osoba = {};

                tempCustomer.osoba.Id_Osigurani_entitet = -1;//null?
                tempCustomer.osoba.JMBG_Osoba = currCustomer.jmbg;
                tempCustomer.osoba.Ime_Osoba = currCustomer.name;
                tempCustomer.osoba.Prezime_Osoba = currCustomer.surname;
                tempCustomer.osoba.Broj_pasosa_Osoba = currCustomer.passport;
                tempCustomer.osoba.Adresa_Osoba = currCustomer.street + " " + currCustomer.addresNum + ", " + currCustomer.city;

                if (currCustomer.phoneNum != null && currCustomer.phoneNum != undefined)
                    tempCustomer.osoba.Broj_telefona_Osoba = currCustomer.phoneNum;
                else
                    tempCustomer.osoba.Broj_telefona_Osoba = "";

                if (currCustomer.email != null && currCustomer.email != undefined) {
                    tempCustomer.osoba.E_mail_Osoba = currCustomer.email;
                    tempCustomer.osoba.Nosilac_Osoba = true;
                } else {
                    tempCustomer.osoba.E_mail_Osoba = "";
                    tempCustomer.osoba.Nosilac_Osoba = false;
                }

                tempCustomer.ageGroup = currCustomer.ageGroup;

                tempCustomer.insured = true;
                tempCustomer.carrier = false;

                dto.customers.push(tempCustomer);
                
            }
            
            //I nosilac je osoba ;)
            if (pr.insuranceCarrierIsNotInsured && pr.data.insCarrierNI != null && pr.data.insCarrierNI != undefined) {

                var tempCustomer = {};
                tempCustomer.osoba = {};

                tempCustomer.osoba.Id_Osigurani_entitet = undefined;//null?
                tempCustomer.osoba.JMBG_Osoba = pr.data.insCarrierNI.jmbg;
                tempCustomer.osoba.Ime_Osoba = pr.data.insCarrierNI.name;
                tempCustomer.osoba.Prezime_Osoba = pr.data.insCarrierNI.surname;
                tempCustomer.osoba.Broj_pasosa_Osoba = pr.data.insCarrierNI.passport;
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
                dto.customers[index].osoba.Broj_telefona_Osoba = pr.tempPhoneNum;
                dto.customers[index].carrier = true;
            }


            //Rizici?
            if (pr.data.object != null && pr.data.object != undefined) {
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

            //Rizici?
            if (pr.data.vehicle != null && pr.data.vehicle != undefined) {
                dto.vehicleData = {};
                dto.vehicleData.vehicle = {};

                dto.vehicleData.vehicle.Id_Osigurani_entitet = -1;
                dto.vehicleData.vehicle.JMBG_Vlasnik_Vozilo = pr.data.vehicle.customer.jmbg;
                dto.vehicleData.vehicle.Ime_Vlasnik_Vozilo = pr.data.vehicle.customer.name;
                dto.vehicleData.vehicle.Prezime_Vlasnik_Vozilo = pr.data.vehicle.customer.surname;
                dto.vehicleData.vehicle.Broj_sasije_Vozilo = pr.data.vehicle.chassisNumber;
                dto.vehicleData.vehicle.Broj_registarske_tablice_Vozilo = pr.data.vehicle.registrationNumber;
                dto.vehicleData.vehicle.Godina_proizvodnje_Vozilo = pr.data.vehicle.productionYear;

                if (pr.data.towing) {
                    dto.vehicleData.tow = pr.data.selectedTowingDistance
                } else
                    dto.vehicleData.tow = -1;

                if (pr.data.repair) {
                    dto.vehicleData.repair = pr.data.selectedReparationPrice;
                } else
                    dto.vehicleData.repair = -1;

                if (pr.data.hotel) {
                    dto.vehicleData.accom = pr.data.selectedHotelDays;
                } else
                    dto.vehicleData.accom = -1;

                if (pr.data.alternateTransport) {
                    dto.vehicleData.ride = pr.data.selectedAlternateTransportationDistance;
                } else
                    dto.vehicleData.ride = -1;
                
            } else {
                dto.vehicleData = null;
            }


            console.log("BAAAA");
            console.log(dto);

            processService.finalizeProcess(dto).then(function(response){
                
                console.log(response);
            });
            

        }

        pr.selectedProcessPanel = [true, false, false, false, false];
        pr.showUserDetails = true;
        

        pr.insuranceCarrierIsNotInsured = false;

        /* Razmisliti o slanju podataka. Podaci za racunanje idu rules aplikaciji (pr.data!!!),
           a ostali mozda bolje odmah u web api. Mozda sve zajedno ipak?
        */

        var chooseSport = false;    // refaktorisati var u pr. !!!
        var chooseRepair = false;
        var chooseHotel = false;
        var temp1 = false;
        var temp2 = false;

        dataAccessService.getSports().then(function (response) {
            pr.sports = response;
        });

        dataAccessService.getAgeGroups().then(function (response) {
            pr.ageGroups = response;
        });

        dataAccessService.getLocations().then(function (response) {
            pr.locations = response;
        });

        dataAccessService.getInsuranceAmounts().then(function (response) {
            pr.insuranceAmounts = response;
        });

        dataAccessService.getRealEstateAges().then(function (response) {
            pr.realEstateAges = response;
        });

        dataAccessService.getRealEstateValues().then(function (response) {
            pr.realEstateValues = response;
        });

        dataAccessService.getTowingDistances().then(function (response) {
            pr.towingDistances = response;
        });

        dataAccessService.getAlternateTransportationDistances().then(function (response) {
            pr.alternateTransportationDistances = response;
        });

        dataAccessService.getReparationPrices().then(function (response) {
            pr.reparationPrices = response;
        });

        dataAccessService.getHotelDays().then(function (response) {
            pr.hotelDays = response;
        });

        /******         COMMON VALIDATION           ******/
        pr.validAge = function (jmbgValue, ageString) {
            if (jmbgValue.length != 13)
                return false;

            var age = parseInt(ageString);
            var day = parseInt(jmbgValue.substring(0, 2));
            var month = parseInt(jmbgValue.substring(2, 4)) - 1;
            var yearString = jmbgValue[4]==0 ? '2' : '1' + jmbgValue.substring(4, 7)
            var year = parseInt(yearString) + age;

            var validDate = new Date(year, month, day);
            var currentDate = new Date();

            if (currentDate.getTime() < validDate.getTime())
                return false;

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
            if (!$scope.firstPageForm.$valid) {
                pr.showErrorsFirst = true;
                return false;
            } else {
                pr.showErrorsFirst = false;
                return true;
            }
        }

        /******         THIRD PAGE VALIDATION       ******/
        pr.showErrorsThird = false;

        pr.goFromThirdPage = function () {
            if (pr.hideObjectInsurance) {
                if (!pr.everythingIsValidThird()) {
                    return;
                }
            }
            pr.selectedProcessPanel = [false, false, false, true, false];
        }

        pr.everythingIsValidThird = function () {
            pr.validateObjectOptions();
            pr.validateObjectJmbg();
            if (!$scope.thirdPageForm.$valid) {
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
            if (!pr.validAge(pr.data.object.owner.jmbg, 18)) {
                $scope.thirdPageForm.nameObjectJmbg.$setValidity("jmbg", false);
            } else {
                $scope.thirdPageForm.nameObjectJmbg.$setValidity("jmbg", true);
            }
        }

        pr.validateObjectOptions = function () {
            if (!pr.data.residenceFromFlood && !pr.data.residenceFromFire && !pr.data.residenceFromTheft) {
                $scope.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", false);
                $scope.thirdPageForm.nameObjectFire.$setValidity("chooseObject", false);
                $scope.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", false);
            } else {
                $scope.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", true);
                $scope.thirdPageForm.nameObjectFire.$setValidity("chooseObject", true);
                $scope.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", true);
            }
        }

        pr.disableObjects = function () {
            pr.showErrorsThird = false;
            pr.data.residenceFromFlood = false;
            pr.data.residenceFromFire = false;
            pr.data.residenceFromTheft = false;
            pr.data.residenceSize = "";
            pr.data.object.owner.name = "";
            pr.data.object.owner.surname = "";
            pr.data.object.owner.jmbg = "";
            pr.data.object.address.street = "";
            pr.data.object.address.number = "";
            pr.data.object.address.city = "";
            $scope.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", true);
            $scope.thirdPageForm.nameObjectFire.$setValidity("chooseObject", true);
            $scope.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", true);
            $scope.thirdPageForm.nameObjectJmbg.$setValidity("validJmbg", true);
        }

        /******         FOURTH PAGE VALIDATION       ******/
        pr.showErrorsFourth = false;
        pr.currentYear = (new Date()).getFullYear();

        pr.goFromFourthPage = function () {
            if (pr.hideVehicleInsurance) {
                if (!pr.everythingIsValidFourth()) {
                    return;
                }
            }
            pr.selectedProcessPanel = [false, false, false, false, true];
        }

        pr.everythingIsValidFourth = function () {
            pr.validateVehicleOptions();
            pr.validateVehicleJmbg();
            if (!$scope.fourthPageForm.$valid) {
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
            if (!pr.validAge(pr.data.vehicle.customer.jmbg, 18)) {
                $scope.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", false);
            } else {
                $scope.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", true);
            }
        }

        pr.validateVehicleOptions = function () {
            if (!pr.data.alternateTransport && !pr.data.hotel && !pr.data.repair && !pr.data.towing) {
                $scope.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", false);
                $scope.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", false);
                $scope.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", false);
                $scope.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", false);
            } else {
                $scope.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
                $scope.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
                $scope.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
                $scope.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
            }
        }

        pr.disableVehicles = function () {
            pr.showErrorsFourth = false;
            pr.data.towing = false;
            pr.data.repair = false;
            pr.data.hotel = false;
            pr.data.alternateTransport = false;
            pr.data.vehicle.chassisNumber = "";
            pr.data.vehicle.productionYear = "";
            pr.data.vehicle.registrationNumber = "";
            pr.data.vehicle.customer.name = "";
            pr.data.vehicle.customer.surname = "";
            pr.data.vehicle.customer.jmbg = "";
            $scope.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", true);
            $scope.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
            $scope.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
            $scope.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
            $scope.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
        }

        /******         FINAL PAGE VALIDATION       ******/
        pr.showErrorsFinal = false;
        pr.tempPhoneNum = "";
        pr.tempEmail = "";

        pr.everythingIsValidFinal = function () {
            pr.validateCarrierJmbg();
            if (!$scope.finalPageForm.$valid) {
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
            if (!pr.validAge(pr.data.insCarrierNI.jmbg, 18)) {
                $scope.finalPageForm.nameJmbgNew.$setValidity("jmbg", false);
            } else {
                $scope.finalPageForm.nameJmbgNew.$setValidity("jmbg", true);
            }
        }
        
        pr.switchCarrier = function () {
            pr.showErrorsFinal = false;

            if (!pr.insuranceCarrierIsNotInsured) {
                $scope.finalPageForm.nameJmbgNew.$setValidity("jmbg", true);
                $scope.finalPageForm.nameNameNew.$setUntouched();
                $scope.finalPageForm.nameSurnameNew.$setUntouched();
                $scope.finalPageForm.nameJmbgNew.$setUntouched();
                $scope.finalPageForm.nameStreetNew.$setUntouched();
                $scope.finalPageForm.nameNumberNew.$setUntouched();
                $scope.finalPageForm.nameCityNew.$setUntouched();
                $scope.finalPageForm.namePhoneNew.$setUntouched();
                $scope.finalPageForm.nameEmailNew.$setUntouched();
                pr.data.insCarrierNI.name = "";
                pr.data.insCarrierNI.surname = "";
                pr.data.insCarrierNI.jmbg = "";
                pr.data.insCarrierNI.phoneNum = "";
                pr.data.insCarrierNI.email = "";
                pr.data.insCarrierNI.address.street = "";
                pr.data.insCarrierNI.address.number = "";
                pr.data.insCarrierNI.address.city = "";
            } else {
                pr.tempPhoneNum = "";
                pr.tempEmail = "";
                $scope.finalPageForm.namePhoneIncluded.$setUntouched();
                $scope.finalPageForm.nameEmailIncluded.$setUntouched();
            }
        }
    }

})();