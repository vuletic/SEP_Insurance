describe("process controller", function() {
	var pc, processService, dataAccessService, $stateParams, $scope;
	

	beforeEach(module("app"));
	beforeEach(module("ui.router"));
	beforeEach(module("ngAnimate"));
	beforeEach(module("ng-slide-down"));
	beforeEach(module("ngSanitize"));

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

	    $provide.value('$scope', {
	        data: {}
	    });
		
	}));

	beforeEach(inject(function($controller, _dataAccessService_, _processService_, _$stateParams_, _$scope_) {
		processService = _processService_;
		dataAccessService = _dataAccessService_;
		$stateParams = _$stateParams_;
		$scope = _$scope_;
		pc = $controller("processController", {
			processService: processService,
			dataAccessService: dataAccessService,
			$stateParams: $stateParams,
			$scope: $scope
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
		$scope.firstPageForm = {$valid: true};

		expect(pc.everythingIsValidFirst()).toBe(true);
		expect(pc.showErrorsFirst).toBe(false);

		$scope.firstPageForm = {$valid: false};

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
		$scope.thirdPageForm = {$valid: true};

		expect(pc.everythingIsValidThird()).toBe(true);
		expect(pc.showErrorsThird).toBe(false);

		$scope.thirdPageForm = {$valid: false};

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
		$scope.fourthPageForm = {$valid: true};

		expect(pc.everythingIsValidFourth()).toBe(true);
		expect(pc.showErrorsFourth).toBe(false);

		$scope.fourthPageForm = {$valid: false};

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
		$scope.finalPageForm = {$valid: true};

		expect(pc.everythingIsValidFinal()).toBe(true);
		expect(pc.showErrorsFinal).toBe(false);

		$scope.finalPageForm = {$valid: false};

		expect(pc.everythingIsValidFinal()).toBe(false);
		expect(pc.showErrorsFinal).toBe(true);

	});

	it("should validate jmbg for real estate owner", function(){
		$scope.thirdPageForm = {};
		$scope.thirdPageForm.nameObjectJmbg = {};
		$scope.thirdPageForm.nameObjectJmbg.$setValidity = function(string, boolean){};
		pc.validAge = function(data){ return true;}

		spyOn($scope.thirdPageForm.nameObjectJmbg, '$setValidity');

		pc.validateObjectJmbg();

		expect($scope.thirdPageForm.nameObjectJmbg.$setValidity).not.toHaveBeenCalled();

		pc.data.object = {owner: 'f'};
		pc.data.object.owner = {jmbg: '1913249'};

		pc.validateObjectJmbg();

		expect($scope.thirdPageForm.nameObjectJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

		pc.validAge = function(data){ return false;}

		pc.validateObjectJmbg();

		expect($scope.thirdPageForm.nameObjectJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

	});

	it("should test disable objects", function(){
		$scope.thirdPageForm = {};
		$scope.thirdPageForm.nameObjectJmbg = {};
		$scope.thirdPageForm.nameObjectFlood = {};
		$scope.thirdPageForm.nameObjectFire = {};
		$scope.thirdPageForm.nameObjectTheft = {};
		$scope.thirdPageForm.nameObjectJmbg.$setValidity = function(string, boolean){};
		$scope.thirdPageForm.nameObjectFlood.$setValidity = function(string, boolean){};
		$scope.thirdPageForm.nameObjectFire.$setValidity = function(string, boolean){};
		$scope.thirdPageForm.nameObjectTheft.$setValidity = function(string, boolean){};
		spyOn($scope.thirdPageForm.nameObjectJmbg, '$setValidity');
		spyOn($scope.thirdPageForm.nameObjectFlood, '$setValidity');
		spyOn($scope.thirdPageForm.nameObjectFire, '$setValidity');
		spyOn($scope.thirdPageForm.nameObjectTheft, '$setValidity');
		pc.realEstateAges = [{Id_Rizik: 1}];
		pc.realEstateValues = [{Id_Rizik: 1}];

		pc.disableObjects();

		expect($scope.thirdPageForm.nameObjectFlood.$setValidity).toHaveBeenCalledWith("chooseObject", true);
		expect($scope.thirdPageForm.nameObjectFire.$setValidity).toHaveBeenCalledWith("chooseObject", true);
		expect($scope.thirdPageForm.nameObjectTheft.$setValidity).toHaveBeenCalledWith("chooseObject", true);
		expect($scope.thirdPageForm.nameObjectJmbg.$setValidity).toHaveBeenCalledWith("validJmbg", true);		

		expect(pc.showErrorsThird).toEqual(false);
		expect(pc.data.residenceFromFlood).toEqual(false);
		expect(pc.data.residenceFromFire).toEqual(false);
		expect(pc.data.residenceFromTheft).toEqual(false);
	});

	it("should validate jmbg for vehicle owner", function(){
		$scope.fourthPageForm = {};
		$scope.fourthPageForm.nameVehicleJmbg = {};
		$scope.fourthPageForm.nameVehicleJmbg.$setValidity = function(string, boolean){};
		pc.validAge = function(data){ return true;}

		spyOn($scope.fourthPageForm.nameVehicleJmbg, '$setValidity');

		pc.validateVehicleJmbg();

		expect($scope.fourthPageForm.nameVehicleJmbg.$setValidity).not.toHaveBeenCalled();

		pc.data.vehicle = {customer: 'f'};
		pc.data.vehicle.customer = {jmbg: '1913249'};

		pc.validateVehicleJmbg();

		expect($scope.fourthPageForm.nameVehicleJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

		pc.validAge = function(data){ return false;}

		pc.validateVehicleJmbg();

		expect($scope.fourthPageForm.nameVehicleJmbg.$setValidity).toHaveBeenCalledWith("jmbg", true);

	});


});