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
                localization: '='
            },
            link: function ($scope, element, attrs, ctrls) {
                var it = $scope;

                it.tempCustomer = {};
                it.selected = -1;
                it.editProcess = false;

                dataAccessService.getAgeGroups().then(function (response) {
                    it.categories = response;
                    it.tempCustomer.category = "0";
                });


                it.addCustomer = function () {
                    if (it.selected != -1) {
                        it.insurees[it.selected].cssClass = "not_selected";
                        it.selected = -1;
                    }
                    it.showUserDetails = true;
                }

                it.deleteCustomer = function () {
                    if (it.selected == -1)
                        return;
                    it.insurees.splice(it.selected, 1);
                    it.selected = -1;
                }

                it.editCustomer = function () {
                    if (it.selected == -1)
                        return;
                    it.editProcess = true;
                    var temp = it.insurees[it.selected];
                    it.tempCustomer = JSON.parse(JSON.stringify(temp));
                    it.showUserDetails = true;
                }

                it.selectCustomer = function (index) {
                    if (it.selected != -1)
                        it.insurees[it.selected].cssClass = "not_selected";

                    it.insurees[index].cssClass = "selected";
                    it.selected = index;
                }

                it.commit = function () {
                    var temp = JSON.parse(JSON.stringify(it.tempCustomer));
                    temp.ageGroup = it.categories[temp.category].Id_Rizik;

                    if (!it.editProcess) {
                        temp.cssClass = "not_selected";
                        it.insurees.push(temp);
                    } else {
                        it.insurees.splice(it.selected, 1, temp);
                        it.editProcess = false;
                    }

                    it.showUserDetails = false;
                    if (it.selected != -1) {
                        it.insurees[it.selected].cssClass = "not_selected";
                        it.selected = -1;
                    }
                    it.tempCustomer = {};
                    it.tempCustomer.category = "0";
                };
            }
        };
        return insureesTableDirective;
    }
})();