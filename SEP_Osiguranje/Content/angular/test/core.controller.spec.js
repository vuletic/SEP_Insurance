describe("controller", function() {
	var $controller, coreCtrl, $window, $q;
	var localization = {};

	beforeEach(module("app"));
	beforeEach(module("ui.router"));
	beforeEach(module("ngAnimate"));
	beforeEach(module("ng-slide-down"));

	beforeEach(module(function($provide){
		$provide.value('localization', {
        getLocalizationObj: function() {
          return { 
            then: function(callback) {return callback([{ some: "thing", lng: {serbian: true}}]);}
          };
        }
      });
		
	}));

	beforeEach(inject(function($injector) {
	  $controller = $injector.get('$controller');
	  
	  localization = $injector.get('localization');
	  $window = $injector.get('$window');
	  $q = $injector.get('$q');

	 

    	 coreCtrl = $controller("coreController", {
			localization: localization,
			$window: $window
		});

	}));


	it("should call localization service", function() {
		spyOn(localization, 'getLocalizationObj').and.callThrough();

		coreCtrl.localize('srpski');
		expect(localization.getLocalizationObj).toHaveBeenCalled();
		coreCtrl.localize('english');
		expect(localization.getLocalizationObj).toHaveBeenCalled();
	});


});