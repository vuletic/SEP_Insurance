(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['dataAccessService', 'processService', '$stateParams'];
    function processController(dataAccessService, processService, $stateParams) {        
        
        var pr = this;

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

                dto.customers.push(tempCustomer);
                
            }
            
            //I nosilac je osoba ;)
            if (pr.data.insCarrierNI != null && pr.data.insCarrierNI != undefined) {

                var tempCustomer = {};
                tempCustomer.osoba = {};

                tempCustomer.osoba.Id_Osigurani_entitet = undefined;//null?
                tempCustomer.osoba.JMBG_Osoba = pr.data.insCarrierNI.jmbg;
                tempCustomer.osoba.Ime_Osoba = pr.data.insCarrierNI.name;
                tempCustomer.osoba.Prezime_Osoba = pr.data.insCarrierNI.surname;
                tempCustomer.osoba.Broj_pasosa_Osoba = pr.data.insCarrierNI.passport;
                tempCustomer.osoba.Adresa_Osoba = pr.data.insCarrierNI.address.street + " " + pr.data.insCarrierNI.address.addresNum + ", " + pr.data.insCarrierNI.address.city;
                tempCustomer.osoba.Broj_telefona_Osoba = pr.data.insCarrierNI.phoneNum;
                tempCustomer.osoba.E_mail_Osoba = pr.data.insCarrierNI.email;

                tempCustomer.ageGroup = -1;
                dto.customers.push(tempCustomer);

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
                dto.objectData.obj.Starost_Nekretnina = pr.data.selectedRealEstateAge;
                dto.objectData.obj.Procenjena_vrednost_Nekretnina = pr.data.selectedRealEstateValue;

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

                if (pr.data.vehicle.cover.tow) {
                    dto.vehicleData.tow = pr.data.selectedTowingDistance;
                } else
                    dto.vehicleData.tow = -1;

                if (pr.data.vehicle.cover.repair) {
                    dto.vehicleData.repair = pr.data.selectedReparationPrice;
                } else
                    dto.vehicleData.repair = -1;

                if (pr.data.vehicle.cover.accom) {
                    dto.vehicleData.accom = pr.data.selectedHotelDays;
                } else
                    dto.vehicleData.accom = -1;

                if (pr.data.vehicle.cover.ride) {
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
        
    }

})();