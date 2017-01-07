(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['dataAccessService', '$stateParams'];
    function processController(dataAccessService, $stateParams) {        
        
        var pr = this;

        
        if ($stateParams.data != null)
            pr.data = $stateParams.data;
        else
            pr.data = {};

        pr.data.customers = [];



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