(function () {
	'use strict';

	angular
		.module('app', ['ui.router', 'ngAnimate', 'ng-slide-down', 'ngSanitize']);
})();
(function () {
    'use strict';

    angular
		.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/home");

      $stateProvider
        .state('core', {
            url: '/',
            templateUrl: 'Content/angular/app/components/core/core.html',
            controller: 'coreController',
            controllerAs: 'cr'
        })
        .state('core.home', {
            url: 'home',
            templateUrl: 'Content/angular/app/components/home/home.html',
            controller: 'homeController',
            controllerAs: 'hc',
        })
        .state('core.process', {
            url: 'process',
            templateUrl: 'Content/angular/app/components/process/process.html',
            controller: 'processController',
            params: {
                data: null
            },
            controllerAs: 'pr'
        })
        .state('core.about', {
            url: 'about',
            templateUrl: 'Content/angular/app/components/about/about.html',
            controller: 'aboutController',
            controllerAs: 'ac'
        })
        .state('core.calculator', {
            url: 'calculator',
            templateUrl: 'Content/angular/app/components/calculator/calculator.html',
            controller: 'calculatorController',
            controllerAs: 'cc'
        })
        .state('core.preview', {
            url: 'preview',
            templateUrl: 'Content/angular/app/components/preview/preview.html',
            controller: 'previewController',
            params: {
                data: null,
                info: null
            },
            controllerAs: 'pc'
        });

        }]);


})();

(function () {
    'use strict';

    angular
		.module('app')
		.controller('aboutController', aboutController);

    function aboutController() {
        var ac = this;
        
    }


})();
(function () {
    'use strict';

    angular
		.module('app')
		.controller('calculatorController', calculatorController);

    calculatorController.$inject = ['$scope', 'dataAccessService', 'calculatorService', '$state'];
    function calculatorController($scope, dataAccessService, calculatorService, $state) {
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
            cc.data.enableSport = cc.data.sport;
            cc.priceIsCalculated = true;
            calculatorService.sendCalculateData(cc.data).then(function (response) {
                cc.calculatedPrice = response;
            });
            $scope.calculatorForm.$setPristine();
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
            if (!$scope.calculatorForm.$valid) {
                cc.showErrors = true;
                if (!$scope.calculatorForm.nameDateFrom.$valid || !$scope.calculatorForm.nameDateTo.$valid || !$scope.calculatorForm.nameCountYoung.$valid)
                    cc.showInsurance = true;
                if (cc.enableObject) {
                    if (!$scope.calculatorForm.nameObjectFire.$valid || !$scope.calculatorForm.nameObjectSize.$valid)
                        cc.showObject = true;
                }
                if (cc.enableVehicle) {
                    if (!$scope.calculatorForm.nameVehicleTransport.$valid)
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
            $scope.calculatorForm.nameObjectFlood.$setValidity("chooseObject", true);
            $scope.calculatorForm.nameObjectFire.$setValidity("chooseObject", true);
            $scope.calculatorForm.nameObjectTheft.$setValidity("chooseObject", true);
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
            $scope.calculatorForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
            $scope.calculatorForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
            $scope.calculatorForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
            $scope.calculatorForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
        }

        cc.checkPeopleCount = function () {
            var sum = cc.data.ageNumberYoung + cc.data.ageNumberAdult + cc.data.ageNumberOld;
            if (sum <= 0) {
                $scope.calculatorForm.nameCountYoung.$setValidity("sum", false);
                $scope.calculatorForm.nameCountAdult.$setValidity("sum", false);
                $scope.calculatorForm.nameCountOld.$setValidity("sum", false);
            } else {
                $scope.calculatorForm.nameCountYoung.$setValidity("sum", true);
                $scope.calculatorForm.nameCountAdult.$setValidity("sum", true);
                $scope.calculatorForm.nameCountOld.$setValidity("sum", true);
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
                    $scope.calculatorForm.nameObjectFlood.$setValidity("chooseObject", false);
                    $scope.calculatorForm.nameObjectFire.$setValidity("chooseObject", false);
                    $scope.calculatorForm.nameObjectTheft.$setValidity("chooseObject", false);
                }
            } else {
                if (cc.enableObject) {
                    $scope.calculatorForm.nameObjectFlood.$setValidity("chooseObject", true);
                    $scope.calculatorForm.nameObjectFire.$setValidity("chooseObject", true);
                    $scope.calculatorForm.nameObjectTheft.$setValidity("chooseObject", true);
                }
            }
        }

        cc.validateVehicleOptions = function () {
            if (!cc.data.alternateTransport && !cc.data.hotel && !cc.data.repair && !cc.data.towing) {
                if (cc.enableVehicle) {
                    $scope.calculatorForm.nameVehicleTowing.$setValidity("chooseVehicle", false);
                    $scope.calculatorForm.nameVehicleRepair.$setValidity("chooseVehicle", false);
                    $scope.calculatorForm.nameVehicleHotel.$setValidity("chooseVehicle", false);
                    $scope.calculatorForm.nameVehicleTransport.$setValidity("chooseVehicle", false);
                }
            } else {
                if (cc.enableVehicle) {
                    $scope.calculatorForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
                    $scope.calculatorForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
                    $scope.calculatorForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
                    $scope.calculatorForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
                }
            }
        }
    }
})();
(function () {
    'use strict';

    angular
		.module('app')
		.service('calculatorService', calculatorService);

    calculatorService.$inject = ['$http'];
    function calculatorService($http) {

        function sendCalculateData(data) {
            var resUrl = 'https://sepruleapi.azurewebsites.net/calculator';
            return $http.post(resUrl, data)
            .then(function (response) {
                return response.data;
            });
        }

       
        return {
            sendCalculateData: sendCalculateData
        };
    }


})();
(function () {
    'use strict';

    angular
		.module('app')
		.controller('coreController', coreController);

    coreController.$inject = ['localization', '$window'];
    function coreController(localization, $window) {
        var cr = this;

        cr.localize = function (language) {
            localization.getLocalizationObj(language).then(function (response) {
                cr.l10nObj = response;
                if (cr.l10nObj.lng == 'english') {
                    cr.lang = 1;
                } else {
                    cr.lang = 0;
                }
            });
        };

        cr.scroll = function () {
            $window.scrollTo(0, 240);
        };

        cr.localize("srpski");
   
    }


})();
(function () {
    'use strict';

    angular
		.module('app')
		.service('localization', coreService);

    coreService.$inject = ['$http'];
    function coreService($http) {

        this.getLocalizationObj = function (language) {
            return $http.get("https://infinite-meadow-14263.herokuapp.com/languages/" + language).then(function (response) {
                return response.data;
            });
        }
    }


})();
(function () {
    'use strict';

    angular
		.module('app')
		.controller('homeController', homeController);

    function homeController() {
        var hc = this;
        hc.home = "Home";
    }


})();
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
(function () {
    'use strict';

    angular
		.module('app')
		.controller('processController', processController);

    processController.$inject = ['$scope', 'dataAccessService', 'processService', '$stateParams', '$state'];
    function processController($scope, dataAccessService, processService, $stateParams, $state) {

        var pr = this;
        pr.jmbgRegex = /^(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((9|\d)\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((9|\d)\d{2}))|((0[1-9]|1\d|2[0-8])02((9|\d)\d{2}))|(2902(([6-9]|\d)(0[48]|[2468][048]|[13579][26])|((6|[048]|[26])00))))([0-8][0-9]|9[0-6])([0-9]{3})(\d)$/;

        pr.data = {};

        pr.data.showObjectInsurance = false;
        pr.data.showVehicleInsurance = false;

        pr.data.sport = false;
        pr.data.ageNumberYoung = 0;
        pr.data.ageNumberAdult = 0;
        pr.data.ageNumberOld = 0;
        pr.data.towing = false;
        pr.data.alternateTransport = false;
        pr.data.hotel = false;
        pr.data.repair = false;

        pr.data.tempEmail = "";
        pr.data.insuranceCarrierIsNotInsured = false;

        pr.useDefaultData = true;

        pr.data.vehicle = {};
        pr.data.obj = {};

        if ($stateParams.data != null) {
            pr.data = $stateParams.data;
            pr.data.showObjectInsurance = pr.data.realEstateInsured;
            pr.data.showVehicleInsurance = pr.data.carInsured;
            pr.data.sport = pr.data.enableSport;
            pr.useDefaultData = false;
            if (pr.data.customers == null)
                pr.data.customers = [];
        } else {
            pr.data.customers = [];
            pr.data.customersFilter = [];
        }

        pr.finishProcess = function () {
            if (!pr.everythingIsValidFinal()) {
                return;
            }

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

            if (pr.data.insuranceCarrierIsNotInsured) {

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
                dto.customers[index].osoba.E_mail_Osoba = pr.data.tempEmail;
                dto.customers[index].carrier = true;
            }

            if (pr.data.showObjectInsurance) {
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

            if (pr.data.showVehicleInsurance) {
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
            } else {
                dto.vehicleData = null;
            }

            console.log(dto);
            processService.finalizeProcess(dto).then(function (response) {
                $state.go('core.preview', { data: response, info: pr.data });
            });

        }

        pr.selectedProcessPanel = [true, false, false, false, false];


        dataAccessService.getSports().then(function (response) {
            pr.sports = response;
            if (pr.useDefaultData) {
                pr.data.selectedSport = pr.sports[0].Id_Rizik;
            } else {
                pr.selectedSports = pr.sports.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedSport;
                });
                pr.data.selectedSport = pr.selectedSports[0].Id_Rizik;
            }
        });

        dataAccessService.getAgeGroups().then(function (response) {
            pr.ageGroups = response;
        });

        dataAccessService.getLocations().then(function (response) {
            pr.locations = response;
            if (pr.useDefaultData) {
                pr.data.selectedLocation = pr.locations[0].Id_Rizik;
            } else {
                pr.selectedLocations = pr.locations.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedLocation;
                });
                pr.data.selectedLocation = pr.selectedLocations[0].Id_Rizik;
            }
        });

        dataAccessService.getInsuranceAmounts().then(function (response) {
            pr.insuranceAmounts = response;
            if (pr.useDefaultData) {
                pr.data.selectedInsuranceAmount = pr.insuranceAmounts[0].Id_Rizik;
            } else {
                pr.selectedInsuranceAmounts = pr.insuranceAmounts.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedInsuranceAmount;
                });
                pr.data.selectedInsuranceAmount = pr.selectedInsuranceAmounts[0].Id_Rizik;
            }
        });

        dataAccessService.getRealEstateAges().then(function (response) {
            pr.realEstateAges = response;
            if (pr.useDefaultData) {
                pr.data.selectedRealEstateAge = pr.realEstateAges[0].Id_Rizik;
            } else {
                pr.selectedRealEstateAges = pr.realEstateAges.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedRealEstateAge;
                });
                pr.data.selectedRealEstateAge = pr.selectedRealEstateAges[0].Id_Rizik;
            }
        });

        dataAccessService.getRealEstateValues().then(function (response) {
            pr.realEstateValues = response;
            if (pr.useDefaultData) {
                pr.data.selectedRealEstateValue = pr.realEstateValues[0].Id_Rizik;
            } else {
                pr.selectedRealEstateValues = pr.realEstateValues.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedRealEstateValue;
                });
                pr.data.selectedRealEstateValue = pr.selectedRealEstateValues[0].Id_Rizik;
            }
        });

        dataAccessService.getTowingDistances().then(function (response) {
            pr.towingDistances = response;
            if (pr.useDefaultData) {
                pr.data.selectedTowingDistance = pr.towingDistances[0].Id_Rizik;
            } else {
                pr.selectedTowingDistances = pr.towingDistances.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedTowingDistance;
                });
                pr.data.selectedTowingDistance = pr.selectedTowingDistances[0].Id_Rizik;
            }
        });

        dataAccessService.getAlternateTransportationDistances().then(function (response) {
            pr.alternateTransportationDistances = response;
            if (pr.useDefaultData) {
                pr.data.selectedAlternateTransportationDistance = pr.alternateTransportationDistances[0].Id_Rizik;
            } else {
                pr.selectedAlternateTransportationDistances = pr.alternateTransportationDistances.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedAlternateTransportationDistance;
                });
                pr.data.selectedAlternateTransportationDistance = pr.selectedAlternateTransportationDistances[0].Id_Rizik;
            }
        });

        dataAccessService.getReparationPrices().then(function (response) {
            pr.reparationPrices = response;
            if (pr.useDefaultData) {
                pr.data.selectedReparationPrice = pr.reparationPrices[0].Id_Rizik;
            } else {
                pr.selectedReparationPrices = pr.reparationPrices.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedReparationPrice;
                });
                pr.data.selectedReparationPrice = pr.selectedReparationPrices[0].Id_Rizik;
            }
        });

        dataAccessService.getHotelDays().then(function (response) {
            pr.hotelDays = response;
            if (pr.useDefaultData) {
                pr.data.selectedHotelDays = pr.hotelDays[0].Id_Rizik;
            } else {
                pr.selectedHotelDayss = pr.hotelDays.filter(function (item) {
                    return item.Id_Rizik == pr.data.selectedHotelDays;
                });
                pr.data.selectedHotelDays = pr.selectedHotelDayss[0].Id_Rizik;
            }
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
                //return;
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

        /******         SECCOND PAGE VALIDATION       ******/
        pr.showErrorsSecond = false;

        pr.goFromSecondPage = function () {
            if (!pr.everythingIsValidSecond()) {
                //return;
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
            if (pr.data.showObjectInsurance) {
                if (!pr.everythingIsValidThird()) {
                    return;
                }
            }
            pr.selectedProcessPanel = [false, false, false, true, false];
        }

        pr.everythingIsValidThird = function () {
            if (pr.data.showObjectInsurance) {
                pr.validateObjectOptions();
                pr.validateObjectJmbg();
            }
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
            if (!pr.validAge(pr.data.object.owner.jmbg)) {
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
            pr.data.selectedRealEstateAge = pr.realEstateAges[0].Id_Rizik;
            pr.data.selectedRealEstateValue = pr.realEstateValues[0].Id_Rizik;
            pr.data.residenceSize = "";
            pr.data.object = {};
            $scope.thirdPageForm.nameObjectFlood.$setValidity("chooseObject", true);
            $scope.thirdPageForm.nameObjectFire.$setValidity("chooseObject", true);
            $scope.thirdPageForm.nameObjectTheft.$setValidity("chooseObject", true);
            $scope.thirdPageForm.nameObjectJmbg.$setValidity("validJmbg", true);
        }

        /******         FOURTH PAGE VALIDATION       ******/
        pr.showErrorsFourth = false;
        pr.chooseCarrierDisabled = false;
        pr.currentYear = (new Date()).getFullYear();

        pr.goFromFourthPage = function () {
            pr.filterForCarriers();
            if (pr.data.showVehicleInsurance) {
                if (!pr.everythingIsValidFourth()) {
                    return;
                }
            }
            pr.selectedProcessPanel = [false, false, false, false, true];
        }

        pr.everythingIsValidFourth = function () {
            if (pr.data.showVehicleInsurance) {
                pr.validateVehicleOptions();
                pr.validateVehicleJmbg();
            }
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
            if (!pr.validAge(pr.data.vehicle.customer.jmbg)) {
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
            pr.data.selectedTowingDistance = pr.towingDistances[0].Id_Rizik;
            pr.data.selectedAlternateTransportationDistance = pr.alternateTransportationDistances[0].Id_Rizik;
            pr.data.selectedReparationPrice = pr.reparationPrices[0].Id_Rizik;
            pr.data.selectedHotelDays = pr.hotelDays[0].Id_Rizik;
            pr.data.towing = false;
            pr.data.repair = false;
            pr.data.hotel = false;
            pr.data.alternateTransport = false;
            pr.data.vehicle = {};
            $scope.fourthPageForm.nameVehicleJmbg.$setValidity("jmbg", true);
            $scope.fourthPageForm.nameVehicleTowing.$setValidity("chooseVehicle", true);
            $scope.fourthPageForm.nameVehicleRepair.$setValidity("chooseVehicle", true);
            $scope.fourthPageForm.nameVehicleHotel.$setValidity("chooseVehicle", true);
            $scope.fourthPageForm.nameVehicleTransport.$setValidity("chooseVehicle", true);
        }

        pr.filterForCarriers = function () {
            pr.data.customersFilter = pr.data.customers.filter(function (customer) {
                return customer.category != "0";
            });
            if (pr.data.customersFilter.length == 0) {
                pr.data.insuranceCarrierIsNotInsured = true;
                pr.chooseCarrierDisabled = true;
            } else {
                pr.chooseCarrierDisabled = false;
                pr.data.insCarrierI = "0";
            }
        }

        /******         FINAL PAGE VALIDATION       ******/
        pr.showErrorsFinal = false;

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
            if (!pr.validAge(pr.data.insCarrierNI.jmbg)) {
                $scope.finalPageForm.nameJmbgNew.$setValidity("jmbg", false);
            } else {
                $scope.finalPageForm.nameJmbgNew.$setValidity("jmbg", true);
            }
        }

        pr.switchCarrier = function () {
            pr.showErrorsFinal = false;

            if (!pr.data.insuranceCarrierIsNotInsured) {
                $scope.finalPageForm.nameJmbgNew.$setValidity("jmbg", true);
                $scope.finalPageForm.nameNameNew.$setUntouched();
                $scope.finalPageForm.nameSurnameNew.$setUntouched();
                $scope.finalPageForm.nameJmbgNew.$setUntouched();
                $scope.finalPageForm.nameStreetNew.$setUntouched();
                $scope.finalPageForm.nameNumberNew.$setUntouched();
                $scope.finalPageForm.nameCityNew.$setUntouched();
                $scope.finalPageForm.namePhoneNew.$setUntouched();
                $scope.finalPageForm.nameEmailNew.$setUntouched();
                pr.data.insCarrierNI = {};
            } else {
                pr.data.tempEmail = "";
                pr.data.insCarrierI = "0";
                $scope.finalPageForm.nameEmailIncluded.$setUntouched();
            }
        }
    }
})();
(function () {
    'use strict';

    angular
		.module('app')
		.service('processService', processService);

    processService.$inject = ['$http'];
    function processService($http) {

        this.finalizeProcess = function (data) {

            return $http.post("api/finalize", data).then(function (response) {
                return response.data;
            });

        }


    }


})();
(function () {
    'use strict';

    angular
		.module('app')
		.directive('expanderSimple', expanderSimple);

    expanderSimple.$inject = ['$http'];
    function expanderSimple($http) {
        var expanderSimpleDirective = {
            restrict: 'E',
            transclude: true,
            templateUrl: "../Content/angular/app/directives/expander_simple/expander-simple.html",
            scope: {
                showExpander: '='
            }
        };
        return expanderSimpleDirective;
    }
})();
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
(function () {
    'use strict';

    angular
		.module('app')
		.directive('pageMarker', pageMarker);

    pageMarker.$inject = ['$http'];
    function pageMarker($http) {
        var pageMarkerDirective = {
            restrict: 'E',
            templateUrl: "../Content/angular/app/directives/page_marker/page-marker.html",
            scope: {
                selectedPage: '='
            }
        };
        return pageMarkerDirective;
    }
})();
(function () {
    'use strict';

    angular
		.module('app')
		.service('dataAccessService', dataAccessService);

    dataAccessService.$inject = ['$http'];
    function dataAccessService($http) {

        function getSports() {
            var resUrl = "api/rizik/vrsta/1";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getAgeGroups() {
            var resUrl = "api/rizik/vrsta/2";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getLocations() {
            var resUrl = "api/rizik/vrsta/4";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getInsuranceAmounts() {
            var resUrl = "api/rizik/vrsta/5";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getRealEstateAges() {
            var resUrl = "api/rizik/vrsta/7";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getRealEstateValues() {
            var resUrl = "api/rizik/vrsta/12";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getTowingDistances() {
            var resUrl = "api/rizik/vrsta/13";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getReparationPrices() {
            var resUrl = "api/rizik/vrsta/14";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getAlternateTransportationDistances() {
            var resUrl = "api/rizik/vrsta/15";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        function getHotelDays() {
            var resUrl = "api/rizik/vrsta/16";
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        } 
        
        function getRisk(id) {
            var resUrl = "api/rizik/id/" + id;
            return $http.get(resUrl).then(function (response) {
                return response.data;
            });
        }

        return {
            getSports: getSports,
            getAgeGroups: getAgeGroups,
            getLocations: getLocations,
            getInsuranceAmounts: getInsuranceAmounts,
            getRealEstateAges: getRealEstateAges,
            getRealEstateValues: getRealEstateValues,
            getTowingDistances: getTowingDistances,
            getReparationPrices: getReparationPrices,
            getAlternateTransportationDistances: getAlternateTransportationDistances,
            getHotelDays: getHotelDays,
            getRisk: getRisk
        };


    }


})();
//kom