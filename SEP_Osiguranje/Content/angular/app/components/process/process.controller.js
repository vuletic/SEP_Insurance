(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['dataAccessService', 'processService', '$stateParams'];
    function processController(dataAccessService, processService, $stateParams) {        
        
        var pr = this;

        
        if ($stateParams.data != null)
            pr.data = $stateParams.data;
        else
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

                tempCustomer.category = currCustomer.category;

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

                tempCustomer.category = -1;
                dto.customers.push(tempCustomer);

            }


            //Rizici?
            if (pr.data.object != null && pr.data.object != undefined) {
                dto.obj = {};

                dto.obj.Id_Osigurani_entitet = -1;
                dto.obj.JMBG_vlasnik_Nekretnina = pr.data.object.owner.jmbg;
                dto.obj.Adresa_Nekretnina = pr.data.object.address.street + " " + pr.data.object.address.number + ", " + pr.data.object.address.city;
                dto.obj.Ime_vlasnik_Nekretnina = pr.data.object.owner.name;
                dto.obj.Prezime_vlasnik_Nekretnina = pr.data.object.owner.surname;
                dto.obj.Povrsina_Nekretnina = pr.data.object.area;
                dto.obj.Starost_Nekretnina = pr.data.object.age;
                dto.obj.Procenjena_vrednost_Nekretnina = pr.data.object.value;

            } else {
                dto.obj = null;
            }

            //Rizici?
            if (pr.data.vehicle != null && pr.data.vehicle != undefined) {
                dto.vehicle = {};

                dto.vehicle.Id_Osigurani_entitet = -1;
                dto.vehicle.JMBG_Vlasnik_Vozilo = pr.data.vehicle.customer.jmbg;
                dto.vehicle.Ime_Vlasnik_Vozilo = pr.data.vehicle.customer.name;
                dto.vehicle.Prezime_Vlasnik_Vozilo = pr.data.vehicle.customer.surname;
                dto.vehicle.Broj_sasije_Vozilo = pr.data.vehicle.chassisNumber;
                dto.vehicle.Broj_registarske_tablice_Vozilo = pr.data.vehicle.registrationNumber;
                dto.vehicle.Godina_proizvodnje_Vozilo = pr.data.vehicle.productionYear;
            } else {
                dto.vehicle = null;
            }


            console.log("BAAAA");
            console.log(dto);

            processService.finalizeProcess(dto).then(function(response){
                
                console.log(response);
            });
            

        }

        pr.selectedProcessPanel = [true, false, false, false, false];
        pr.showUserDetails = true;
        pr.hideObjectInsurance = false;
        pr.hideVehicleInsurance = false;

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
        
    }

})();