describe("service", function() {
	var $state, $urlRouter;

	beforeEach(module("app"));
	beforeEach(module("ui.router"));
	beforeEach(module("ngAnimate"));
	beforeEach(module("ng-slide-down"));
	beforeEach(module("ngSanitize"));

	describe("localizationService", function() {
		var $httpBackend, localization;
		var appUrl = "https://infinite-meadow-14263.herokuapp.com";

		beforeEach(inject(function(_localization_, _$httpBackend_){   
			localization = _localization_;
			$httpBackend = _$httpBackend_;
		}));


		it("should request given languages", function() {
			$httpBackend.expectGET(appUrl + "/languages/srpski").respond({results:[],count:0});
			localization.getLocalizationObj("srpski");
			$httpBackend.flush();

			$httpBackend.expectGET(appUrl + "/languages/english").respond({results:[],count:0});
			localization.getLocalizationObj("english");
			$httpBackend.flush();
		});

		

	afterEach(function() {
		$httpBackend.verifyNoOutstandingRequest();
    	$httpBackend.verifyNoOutstandingExpectation();
	});

	});
});