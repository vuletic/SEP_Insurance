describe("calculator controller", function() {
	var calculatorController, calculatorService, dataAccessService, $state;
	

	beforeEach(module("app"));
	beforeEach(module("ui.router"));
	beforeEach(module("ngAnimate"));
	beforeEach(module("ng-slide-down"));

	beforeEach(module(function($provide){  // mockuj servise
		/*$provide.value('dataAccessService', {
	        getSports: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getAgeGroups: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getLocations: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getInsuranceAmounts: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getRealEstateAges: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getRealEstateValues: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getTowingDistances: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getHotelDays: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getAlternateTransportationDistances: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
	        getReparationPrices: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        },
      	});*/

		$provide.value('calculatorService', {
	        sendCalculateData: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        }
	    });
	    $provide.value('$state', {
	        go: function() {}
	       });
	   
		
	}));

	beforeEach(inject(function($controller, _dataAccessService_, _calculatorService_, _$state_) {
		calculatorService = _calculatorService_;
		dataAccessService = _dataAccessService_;
		$state = _$state_;
		calculatorController = $controller("calculatorController", {
			calculatorService: calculatorService,
			dataAccessService: dataAccessService,
			$state: $state
		});
		calculatorController.calculatorForm = {}
		calculatorController.calculatorForm.$setPristine = function(){};
	}));


	it("should call everythingIsValid function and not sendCalculateData", function() {
		spyOn(calculatorService, 'sendCalculateData').and.callThrough();

		spyOn(calculatorController, 'everythingIsValid').and.returnValue(false);
		calculatorController.calculate();

		expect(calculatorController.everythingIsValid).toHaveBeenCalled();
		expect(calculatorService.sendCalculateData).not.toHaveBeenCalled();
		expect(calculatorController.priceIsCalculated).toBe(false);

	});

	it("should call everythingIsValid function and sendCalculateData", function() {
		spyOn(calculatorService, 'sendCalculateData').and.callThrough();

		spyOn(calculatorController, 'everythingIsValid').and.returnValue(true);
		calculatorController.calculate();

		expect(calculatorController.everythingIsValid).toHaveBeenCalled();
		expect(calculatorService.sendCalculateData).toHaveBeenCalled();
		expect(calculatorController.priceIsCalculated).toBe(true);
	});

	it("proceed to process", function() {
		
		calculatorController.proceedToProcess();

		expect(calculatorController.data.realEstateInsured).toBe(calculatorController.enableObject);
		expect(calculatorController.data.carInsured).toBe(calculatorController.enableVehicle);
	});

	it("disable objects", function(){
		var obj1 = {Id_Rizik: 7}, obj2 = {Id_Rizik: 14};
		calculatorController.realEstateAges = [obj1];
		calculatorController.realEstateValues = [obj2];
		calculatorController.calculatorForm.nameObjectFlood = {};
		calculatorController.calculatorForm.nameObjectFire = {};
		calculatorController.calculatorForm.nameObjectTheft = {};
		calculatorController.calculatorForm.nameObjectFlood.$setValidity = function(){};
		calculatorController.calculatorForm.nameObjectTheft.$setValidity = function(){};
		calculatorController.calculatorForm.nameObjectFire.$setValidity = function(){};

		calculatorController.disableObjects();

		expect(calculatorController.data.residenceSize).toBe("");
        expect(calculatorController.data.residenceFromFlood).toBe(false);
        expect(calculatorController.data.residenceFromFire).toBe(false);
        expect(calculatorController.data.residenceFromTheft).toBe(false);
        expect(calculatorController.data.selectedRealEstateAge).toBe(calculatorController.realEstateAges[0].Id_Rizik);
        expect(calculatorController.data.selectedRealEstateValue).toBe(calculatorController.realEstateValues[0].Id_Rizik);

	});

	it("disable vehicles", function(){
		var obj1 = {Id_Rizik: 7}, obj2 = {Id_Rizik: 14}, obj3 = {Id_Rizik: 1}, obj4 = {Id_Rizik: 15};
		calculatorController.towingDistances = [obj1];
		calculatorController.reparationPrices = [obj2];
		calculatorController.hotelDays = [obj3];
		calculatorController.alternateTransportationDistances = [obj4];
		calculatorController.calculatorForm.nameVehicleTowing = {};
		calculatorController.calculatorForm.nameVehicleHotel = {};
		calculatorController.calculatorForm.nameVehicleTransport = {};
		calculatorController.calculatorForm.nameVehicleRepair = {};
		calculatorController.calculatorForm.nameVehicleTowing.$setValidity = function(){};
		calculatorController.calculatorForm.nameVehicleHotel.$setValidity = function(){};
		calculatorController.calculatorForm.nameVehicleTransport.$setValidity = function(){};
		calculatorController.calculatorForm.nameVehicleRepair.$setValidity = function(){};

		calculatorController.disableVehicles();

        expect(calculatorController.data.towing).toBe(false);
        expect(calculatorController.data.repair).toBe(false);
        expect(calculatorController.data.hotel).toBe(false);
        expect(calculatorController.data.alternateTransport).toBe(false);
        expect(calculatorController.data.selectedTowingDistance).toBe(calculatorController.towingDistances[0].Id_Rizik);
        expect(calculatorController.data.selectedReparationPrice).toBe(calculatorController.reparationPrices[0].Id_Rizik);
        expect(calculatorController.data.selectedHotelDays).toBe(calculatorController.hotelDays[0].Id_Rizik);
        expect(calculatorController.data.selectedAlternateTransportationDistance).toBe(calculatorController.alternateTransportationDistances[0].Id_Rizik);

	});


});