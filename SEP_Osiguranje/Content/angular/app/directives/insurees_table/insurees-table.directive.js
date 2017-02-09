(function () {
    'use strict';

    angular
		.module('app')
		.directive('insureesTable', insureesTable);

    insureesTable.$inject = ['$http', 'dataAccessService'];
    function insureesTable($http, dataAccessService) {
        var insureesTableDirective = {
            restrict: 'E',
            transclude: false,
            templateUrl: "../Content/angular/app/directives/insurees_table/insurees-table.html",
            scope: {
                insurees: '=',
                localization: '=',
                processError: '=',
                jmbgPattern: '='
            },
            link: function ($scope, element, attrs, ctrls) {
                var it = $scope;

                it.tempCustomer = {};
                it.selected = -1;
                it.editProcess = false;
                it.changeTypeHeader = "";
                it.changeTypeFooter = "";

                dataAccessService.getAgeGroups().then(function (response) {
                    it.categories = response;
                    it.tempCustomer.category = "0";
                });


                it.addCustomer = function () {
                    it.clear();
                    it.changeTypeHeader = it.localization.l10nObj.prsPg2HeadAdd;
                    it.changeTypeFooter = it.localization.l10nObj.prsPg2FootAdd;
                }

                it.deleteCustomer = function () {
                    if (it.selected == -1)
                        return;
                    it.insurees.splice(it.selected, 1);
                }

                it.editCustomer = function () {
                    if (it.selected == -1)
                        return;
                    it.changeTypeHeader = it.localization.l10nObj.prsPg2HeadChange;
                    it.changeTypeFooter = it.localization.l10nObj.prsPg2FootChange;
                    it.editProcess = true;
                    var temp = it.insurees[it.selected];
                    it.tempCustomer = JSON.parse(JSON.stringify(temp));
                }

                it.selectCustomer = function (index) {
                    if (it.selected != -1)
                        it.insurees[it.selected].cssClass = "not_selected";

                    it.insurees[index].cssClass = "selected";
                    it.selected = index;
                }

                it.commit = function () {
                    if (!it.insureeIsValid())
                        return;
                    var temp = JSON.parse(JSON.stringify(it.tempCustomer));
                    temp.ageGroup = it.categories[temp.category].Id_Rizik;

                    if (!it.editProcess) {
                        temp.cssClass = "not_selected";
                        it.insurees.push(temp);
                    } else {
                        it.insurees.splice(it.selected, 1, temp);
                        it.editProcess = false;
                    }

                    it.clear();
                    $('#dataModal').modal('hide');
                };

                it.clear = function () {
                    if (it.selected != -1) {
                        it.insurees[it.selected].cssClass = "not_selected";
                        it.selected = -1;
                    }
                    it.tempCustomer = {};
                    it.tempCustomer.jmbg = "";
                    it.tempCustomer.passport = "";
                    it.tempCustomer.addresNum = "";
                    it.tempCustomer.phoneNum = "";
                    it.tempCustomer.category = "0";
                    it.clearValidation();
                }

                /******         VALIDATION                ******/
                it.showErrorsInsuree = false;

                it.insureeIsValid = function () {
                    it.validInsureeGroup();
                    if (!it.insureeForm.$valid) {
                        it.showErrorsInsuree = true;
                        return false;
                    } else {
                        it.showErrorsInsuree = false;
                        return true;
                    }
                }

                it.validInsureeGroup = function () {
                    if (it.tempCustomer == undefined || it.tempCustomer.jmbg == undefined)
                        return;
                    var jmbgValue = it.tempCustomer.jmbg;
                    var min = 0, max = 0;
                    if (it.tempCustomer.category == "0") {
                        min = 0;
                        max = 18;
                    } else if (it.tempCustomer.category == "1") {
                        min = 18;
                        max = 65;
                    } else if (it.tempCustomer.category == "2") {
                        min = 65;
                        max = 111;
                    } else {
                        return false;
                    }

                    if (it.validAge(jmbgValue, min, max)) {
                        it.insureeForm.nameGroup.$setValidity("group", true);
                    } else {
                        it.insureeForm.nameGroup.$setValidity("group", false);
                    }
                }

                it.validAge = function (jmbgValue, min, max) {    
                    var day = parseInt(jmbgValue.substring(0, 2));
                    var month = parseInt(jmbgValue.substring(2, 4)) - 1;
                    var yearString = (jmbgValue[4] == 0 ? '2' : '1') + jmbgValue.substring(4, 7)
                    var yearMin = parseInt(yearString) + min;
                    var yearMax = parseInt(yearString) + max;

                    var validDateMin = new Date(yearMin, month, day);
                    var validDateMax = new Date(yearMax, month, day);
                    var currentDate = new Date();

                    if (validDateMin.getTime() < currentDate.getTime() && currentDate.getTime() < validDateMax.getTime())
                        return true;

                    return false;
                }

                it.clearValidation = function () {
                    it.showErrorsInsuree = false;
                    it.insureeForm.nameGroup.$setValidity("group", true);
                    it.insureeForm.nameJmbg.$setValidity("jmbg", true);

                    it.insureeForm.nameName.$setUntouched();
                    it.insureeForm.nameSurname.$setUntouched();
                    it.insureeForm.nameJmbg.$setUntouched();
                    it.insureeForm.namePassport.$setUntouched();
                    it.insureeForm.nameStreet.$setUntouched();
                    it.insureeForm.nameNumber.$setUntouched();
                    it.insureeForm.nameCity.$setUntouched();
                    it.insureeForm.nameTelephone.$setUntouched();
                    it.insureeForm.nameGroup.$setUntouched();
                }
            }
        };
        return insureesTableDirective;
    }
})();