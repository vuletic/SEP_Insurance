describe("service", function() {
	var $state, $urlRouter;

	beforeEach(module("app"));
	beforeEach(module("ui.router"));
	beforeEach(module("ngAnimate"));
	beforeEach(module("ng-slide-down"));
	beforeEach(module("ngSanitize"));

	describe("dataAccessService", function() {
		var $httpBackend, dataAccessService;
		var appUrl = "api";

		beforeEach(inject(function(_dataAccessService_, _$httpBackend_){   
			dataAccessService = _dataAccessService_;
			$httpBackend = _$httpBackend_;
		}));


		it("should request all sports risks", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/1").respond({results:[],count:0});
			dataAccessService.getSports();
			$httpBackend.flush();
		});

		it("should request all age groups", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/2").respond({results:[],count:0});
			dataAccessService.getAgeGroups();
			$httpBackend.flush();
		});

		it("should request all location risks", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/4").respond({results:[],count:0});
			dataAccessService.getLocations();
			$httpBackend.flush();
		});

		it("should request all insurance amounts", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/5").respond({results:[],count:0});
			dataAccessService.getInsuranceAmounts();
			$httpBackend.flush();
		});

		it("should request all real estate ages", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/7").respond({results:[],count:0});
			dataAccessService.getRealEstateAges();
			$httpBackend.flush();
		});

		it("should request all real estate values", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/12").respond({results:[],count:0});
			dataAccessService.getRealEstateValues();
			$httpBackend.flush();
		});

		it("should request all towing distances", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/13").respond({results:[],count:0});
			dataAccessService.getTowingDistances();
			$httpBackend.flush();
		});

		it("should request all reparation prices", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/14").respond({results:[],count:0});
			dataAccessService.getReparationPrices();
			$httpBackend.flush();
		});

		it("should request all alternate transports", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/15").respond({results:[],count:0});
			dataAccessService.getAlternateTransportationDistances();
			$httpBackend.flush();
		});

		it("should request all hotel days", function() {
			$httpBackend.expectGET(appUrl + "/rizik/vrsta/16").respond({results:[],count:0});
			dataAccessService.getHotelDays();
			$httpBackend.flush();
		});

		afterEach(function() {
		$httpBackend.verifyNoOutstandingRequest();
    	$httpBackend.verifyNoOutstandingExpectation();
	});

	});
});