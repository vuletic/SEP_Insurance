describe("process controller", function() {
	var pc, processService, dataAccessService, $stateParams;
	

	beforeEach(module("app"));
	beforeEach(module("ui.router"));
	beforeEach(module("ngAnimate"));
	beforeEach(module("ng-slide-down"));

	beforeEach(module(function($provide){  
		$provide.value('calculatorService', {
	        sendCalculateData: function() {
	          return { 
	            then: function(callback) {return callback([{ some: "thing"}]);}
	          };
	        }
	    });
	    
	    $provide.value('$stateParams', {
	        data: {}
	    });
		
	}));

	beforeEach(inject(function($controller, _dataAccessService_, _processService_, _$stateParams_) {
		processService = _processService_;
		dataAccessService = _dataAccessService_;
		$stateParams = _$stateParams_;
		pc = $controller("processController", {
			processService: processService,
			dataAccessService: dataAccessService,
			$stateParams: $stateParams
		});
		
	}));

	it("should validate jmbg for underage", function(){

		expect(pc.validAge("string")).toBe(false);
		expect(pc.validAge("0123456789")).toBe(false);
		expect(pc.validAge("0505004223456")).toBe(false);
		expect(pc.validAge("0512999432234")).toBe(false);
		expect(pc.validAge("0101998123123")).toBe(true);

	});

	it("should check if first page is valid", function(){
		pc.firstPageForm = {$valid: true};

		expect(pc.everythingIsValidFirst()).toBe(true);
		expect(pc.showErrorsFirst).toBe(false);

		pc.firstPageForm = {$valid: false};

		expect(pc.everythingIsValidFirst()).toBe(false);
		expect(pc.showErrorsFirst).toBe(true);

	});

	it("should set process panel boolean array to second page", function(){
		pc.everythingIsValidFirst = function(){return true;}

		pc.goFromFirstPage();

		expect(pc.selectedProcessPanel).not.toEqual([true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([true, true, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, false, true, false, false]);
		expect(pc.selectedProcessPanel).toEqual([false, true, false, false, false]);

	});

	it("should check if second page is valid", function(){

		expect(pc.everythingIsValidSecond()).toBe(false);
		expect(pc.showErrorsSecond).toBe(true);

		pc.data = {};

		expect(pc.everythingIsValidSecond()).toBe(false);
		expect(pc.showErrorsSecond).toBe(true);

		pc.data.customers = [];

		expect(pc.everythingIsValidSecond()).toBe(false);
		expect(pc.showErrorsSecond).toBe(true);

		pc.data.customers = [{ime: 'pera'}, {ime: 'djole'}];

		expect(pc.everythingIsValidSecond()).toBe(true);
		expect(pc.showErrorsSecond).toBe(false);

	});

	it("should set process panel boolean array to third page", function(){
		pc.everythingIsValidSecond = function(){return true;}

		pc.goFromSecondPage();

		expect(pc.selectedProcessPanel).not.toEqual([true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([true, true, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, false, false, true, false]);
		expect(pc.selectedProcessPanel).toEqual([false, false, true, false, false]);

	});

	it("should check if third page is valid", function(){
		pc.thirdPageForm = {$valid: true};

		expect(pc.everythingIsValidThird()).toBe(true);
		expect(pc.showErrorsThird).toBe(false);

		pc.thirdPageForm = {$valid: false};

		expect(pc.everythingIsValidThird()).toBe(false);
		expect(pc.showErrorsThird).toBe(true);

	});

	it("should set process panel boolean array to fourth page", function(){
		pc.everythingIsValidThird = function(){return true;}

		pc.goFromThirdPage();

		expect(pc.selectedProcessPanel).not.toEqual([true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([true, true, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, false, true, false, false]);
		expect(pc.selectedProcessPanel).toEqual([false, false, false, true, false]);

	});

	it("should check if fourth page is valid", function(){
		pc.fourthPageForm = {$valid: true};

		expect(pc.everythingIsValidFourth()).toBe(true);
		expect(pc.showErrorsFourth).toBe(false);

		pc.fourthPageForm = {$valid: false};

		expect(pc.everythingIsValidFourth()).toBe(false);
		expect(pc.showErrorsFourth).toBe(true);

	});

	it("should set process panel boolean array to fifth page", function(){
		pc.everythingIsValidFourth = function(){return true;}

		pc.goFromFourthPage();

		expect(pc.selectedProcessPanel).not.toEqual([true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([true, true, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, true, false, false, false, false]);
		expect(pc.selectedProcessPanel).not.toEqual([false, false, true, false, false]);
		expect(pc.selectedProcessPanel).toEqual([false, false, false, false, true]);

	});

	it("should check if fifth page is valid", function(){
		pc.finalPageForm = {$valid: true};

		expect(pc.everythingIsValidFinal()).toBe(true);
		expect(pc.showErrorsFinal).toBe(false);

		pc.finalPageForm = {$valid: false};

		expect(pc.everythingIsValidFinal()).toBe(false);
		expect(pc.showErrorsFinal).toBe(true);

	});

	it("should validate jmbg for real estate owner", function(){
		pc.thirdPageForm = {};
		pc.thirdPageForm.nameObjectJmbg = {};
		pc.thirdPageForm.nameObjectJmbg.$setValidity = function(string, boolean){};
		pc.validAge = function(data){ return true;}

		spyOn(pc.thirdPageForm.nameObjectJmbg, '$setValidity');

		pc.validateObjectJmbg();

		expect(pc.thirdPageForm.nameObjectJmbg.$setValidity).not.toHaveBeenCalled();

		pc.data.object = {owner: 'f'};
		pc.data.object.owner = {jmbg: '1913249'};

		pc.validateObjectJmbg();

		expect(pc.thirdPageForm.nameObjectJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

		pc.validAge = function(data){ return false;}

		pc.validateObjectJmbg();

		expect(pc.thirdPageForm.nameObjectJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

	});

	it("should test disable objects", function(){
		pc.thirdPageForm = {};
		pc.thirdPageForm.nameObjectJmbg = {};
		pc.thirdPageForm.nameObjectFlood = {};
		pc.thirdPageForm.nameObjectFire = {};
		pc.thirdPageForm.nameObjectTheft = {};
		pc.thirdPageForm.nameObjectJmbg.$setValidity = function(string, boolean){};
		pc.thirdPageForm.nameObjectFlood.$setValidity = function(string, boolean){};
		pc.thirdPageForm.nameObjectFire.$setValidity = function(string, boolean){};
		pc.thirdPageForm.nameObjectTheft.$setValidity = function(string, boolean){};
		spyOn(pc.thirdPageForm.nameObjectJmbg, '$setValidity');
		spyOn(pc.thirdPageForm.nameObjectFlood, '$setValidity');
		spyOn(pc.thirdPageForm.nameObjectFire, '$setValidity');
		spyOn(pc.thirdPageForm.nameObjectTheft, '$setValidity');
		pc.realEstateAges = [{Id_Rizik: 1}];
		pc.realEstateValues = [{Id_Rizik: 1}];

		pc.disableObjects();

		expect(pc.thirdPageForm.nameObjectFlood.$setValidity).toHaveBeenCalledWith("chooseObject", true);
		expect(pc.thirdPageForm.nameObjectFire.$setValidity).toHaveBeenCalledWith("chooseObject", true);
		expect(pc.thirdPageForm.nameObjectTheft.$setValidity).toHaveBeenCalledWith("chooseObject", true);
		expect(pc.thirdPageForm.nameObjectJmbg.$setValidity).toHaveBeenCalledWith("validJmbg", true);		

		expect(pc.showErrorsThird).toEqual(false);
		expect(pc.data.residenceFromFlood).toEqual(false);
		expect(pc.data.residenceFromFire).toEqual(false);
		expect(pc.data.residenceFromTheft).toEqual(false);
	});

	it("should validate jmbg for vehicle owner", function(){
		pc.fourthPageForm = {};
		pc.fourthPageForm.nameVehicleJmbg = {};
		pc.fourthPageForm.nameVehicleJmbg.$setValidity = function(string, boolean){};
		pc.validAge = function(data){ return true;}

		spyOn(pc.fourthPageForm.nameVehicleJmbg, '$setValidity');

		pc.validateVehicleJmbg();

		expect(pc.fourthPageForm.nameVehicleJmbg.$setValidity).not.toHaveBeenCalled();

		pc.data.vehicle = {customer: 'f'};
		pc.data.vehicle.customer = {jmbg: '1913249'};

		pc.validateVehicleJmbg();

		expect(pc.fourthPageForm.nameVehicleJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

		pc.validAge = function(data){ return false;}

		pc.validateVehicleJmbg();

		expect(pc.fourthPageForm.nameVehicleJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

	});


});