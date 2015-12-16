var app = angular.module('tedx', [
	"ui.router",
	"ngAnimate",
	"ngTouch",
  "restangular",
  "headroom"
]);

// routing
app.config(function($stateProvider, $urlRouterProvider, $locationProvider)  {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('intro', {
            url: '/',
            templateUrl: 'views/intro.tpl.html',
            controller: 'mainController'
        })
        .state('speakers', {
        	url: '/speakers',
        	templateUrl: 'views/speakers.tpl.html',
        	controller: 'speakerController'
        })
        .state('team', {
          url: '/team/:teamName',
          templateUrl: 'views/team.tpl.html',
          controller: 'teamController'
        })
        .state('about', {
          url: '/about',
          templateUrl: 'views/about.tpl.html',
          controller: 'aboutController'
        });

    $locationProvider.html5Mode(true);
});

var configureLoadingHandler = function($rootScope){
  $rootScope.loading = {};
  $rootScope.loading.status = false;

  $rootScope.loading.start = function(){
    var self = this;
    self.status = true;

    // self.timer = setTimeout(function(){
    //   self.status = true;
    // }, 50);
  };
  $rootScope.loading.end = function(){
    clearTimeout(this.timer);
    this.status = false;
  };
};

app.run(function($rootScope, $state) {
  //configure rootScope objects
  //loading handler
  configureLoadingHandler($rootScope);

  //for caching 
  $rootScope.repoData = {};


	$rootScope.$on('$stateChangeSuccess',
	   function (event, toState, toParams, fromState, fromParams) {
	      $rootScope.state = toState.name;
        $rootScope.nav = false;
	   }
	);

	$rootScope.$on('$stateChangeStart', function(e) {
    $rootScope.loading.start();
    window.scrollTo(0, 0);
	});
});

//restangular
app.config(function(RestangularProvider){
  RestangularProvider.setBaseUrl("/api");

  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    if(data.data){
      return data.data;
    }
    //for now just logging and failing
    else if(data.error) {
      console.error(data.error);
      return false;
    }
  });
});
;
app.controller("aboutController", function($scope, $rootScope){
	$rootScope.loading.end();
});;
app.controller("eventController", function($scope){
		
});
;
app.controller("mainController", function($scope, $rootScope){
	//initiate some thangs
	scrollInit();
	particleInit();

	$rootScope.loading.end();
});


var scrollInit = function(){
	var scrollMagicController = new ScrollMagic.Controller();

	// var starfield = new ScrollMagic.Scene({duration: '100%'})
	// 	.setTween("#starfield", {top: "-40%"})
	// 	.addTo(scrollMagicController);
		
	var cta = new ScrollMagic.Scene({duration: '100%'})
		.setTween(".cta", {opacity: 0})
		.addTo(scrollMagicController);

	var arrow = new ScrollMagic.Scene({duration: '100%'})
		.setTween(".arrow_down", {opacity: 0, bottom: '200px'})
		.addTo(scrollMagicController);
};

var particleInit = function(){
	particlesJS.load('starfield', '../assets/particles.json', function() {
	  //particles loaded
	});
};;
app.controller("speakerController", function($scope, $rootScope, api){
	if(!$rootScope.repoData.speakers){
		api.getSpeakers(true).then(function(speakers){
			var speakerData = speakers.plain();
			$rootScope.repoData.speakers = pruneSpeakers(speakers);
			$rootScope.loading.end();
		});
	}
	else {
		$rootScope.loading.end();
	}
});

var pruneSpeakers = function(apiSpeakers){
	var speakerData = apiSpeakers.plain();
	var speakers = {};
	for(var i in speakerData){
		var s = speakerData[i];

		//sort objects by year
		if(speakers[s.year] !== undefined){
			speakers[s.year].push(s);
		}
		else {
			speakers[s.year] = [];
			speakers[s.year].push(s);
		}
	}
	return speakers;
};;
app.controller("teamController", function($scope, $rootScope, api, $stateParams){
	$rootScope.repoData.team = {};
	resolveTeamData(api, $rootScope, function(){
		$rootScope.loading.end();
		console.log("done!");
		$scope.$broadcast("tabSelected", $stateParams.teamName);
	});	
});

//TODO: convert cb to promise
var resolveTeamData = function(api, $rootScope, cb){
	if(!$rootScope.repoData.team.teams){
		api.getTeams(true).then(function(teams){
			$rootScope.repoData.team = {};
			$rootScope.repoData.team.teams = teams.plain();

			if(!$rootScope.repoData.team.teamMembers){
				api.getTeamMembers(true).then(function(teamMembers){
					sortMembers(teamMembers.plain(), $rootScope, function(){
						return cb();
					});
				});
			}
			else {
				return cb();
			}
		});
	}
	else {
		return cb();
	}
};

var sortMembers = function(teamMembers, $rootScope, cb){
	var sorted = {};
	var images = {};
	for(var i in teamMembers){
		var member = teamMembers[i];
		if(sorted[member.team]){
			sorted[member.team].push(member);
			images[member.team].push(member.image);
		}
		else {
			sorted[member.team] = [];
			images[member.team] = [];
			sorted[member.team].push(member);
			images[member.team].push(member.image);
		}
	}

	$rootScope.repoData.team.teamMembers = sorted;
	$rootScope.repoData.team.teamImages = images;
	return cb();
	// return sorted;
};;
app.directive("bgImg", function(){
	return function(scope, element, attrs){
		attrs.$observe("bgImg", function(imgPath){
			element.css({ "background-image": "url(" + imgPath + ")"});
		});
	};
});;
app.directive("fixedFade",function () {
	return {
		restrict: "AE",
		scope: {
			parent: '='
		},
		controller: function() {
			
		},

		link: function($scope, element) {
			/* 
			opacity should be relative to parent
		
			take parent height, divide it by 100

			if currScroll < parent pos -> do nothing
			if currScroll is within parent -> set to Floor(currScroll - parentPos)/heightIncriment

			*/

			console.log($scope.parent);
			console.log($($scope.parent).offset());

			var parentPos = $($scope.parent).offset();
			var parentHeight = $($scope.parent).height();
			var hIncr = parentHeight/100;

			//set initial opacity
			element[0].style.opacity = 1;

			testEl = element[0];
			console.log("element", element[0]);

			$(window).scroll(function(ev) {
				var currScroll = $(window).scrollTop();
				if(currScroll < parentPos){

				}
				else if(currScroll >= parentPos && currScroll <= (parentPos + parentHeight)){
					element[0].style.opacity = Math.floor((currScroll - parentPos)/hIncr);
				}
			});
		}
	};
});;
app.directive("mobileMenu",function () {
	return {
		restrict: "AE",
		templateUrl: "views/mobileMenu.tpl.html",
		controller: function($scope, $rootScope) {
			$rootScope.nav = false;
			$scope.drizzy = "drizzy";

			$scope.toggleNav = function(){
				if(!$scope.nav){
					$rootScope.nav = true;
				}
				else {
					$rootScope.nav = false;
				}
			};

		},

		link: function($scope) {

		}
	};
});
;
app.directive("tab",function () {
	return {
		restrict: "E",
		scope: {
			tabTitle: '='
		},
		transclude: true,
		// require: "^tabGroup",
		templateUrl: "views/tabGroup/tab.tpl.html",
		controller: function($scope, $state) {
			$scope.current = "";

			$scope.$on('tabChanged', function(event, current) {
				$scope.current = current;
			});
		},

		link: function($scope, elem, attr) {
			$scope.$emit("addTab", $scope.tabTitle);
		}
	};
});;
app.directive("tabGroup",function () {
	return {
		restrict: "E",
		transclude: true,
		templateUrl: "views/tabGroup/tabGroup.tpl.html",
		bindToController: true,
		controllerAs: 'tabGroup',
		controller: function($scope, $state) {
			$scope.tabs = [];
			$scope.current = "";

			$scope.select = function(tabKey){
				if($scope.tabs.indexOf(tabKey) > -1){
					$scope.current = tabKey;
					$scope.$broadcast("tabChanged", $scope.current);
				}
			};

			$scope.$on('tabSelected', function(event, key) {
				console.log("key", key);
				$scope.select(key);
			});


			$scope.$on('addTab', function(event, title) {
				$scope.tabs.push(title);
				//sorting: TODO: options
				$scope.tabs.sort(function(a,b){ return b-a; });
				//select first tab
				$scope.select($scope.tabs[0]);
			});

		},

		link: function($scope, el, attrs, ctrl, transclude) {

		}
	};
});;
app.directive("tedHeader",function () {
	return {
		restrict: "AE",
		templateUrl: "views/header.tpl.html",
		controller: function($scope, $state, stateControl) {
			$scope.stateControl = stateControl;
		},

		link: function($scope, elem, attr) {
			switch(elem[0].getAttribute("type")){
				case "solid":
					$scope.isSolid = true;
					break;
				case "transparent":
					$scope.isSolid = false;
					break;
				case "light_transparent":
					$scope.isSolid = true;
					$scope.isTransparent = true;
					break;
				default:
					$scope.isSolid = false;
					break;
			}
		}
	};
});;
app.service('api', function($q, Restangular) {
    return {
      getSpeakers: function(promiseFlag, cb){
        return promiseHandler(Restangular.all('speaker').getList(), promiseFlag);
      },
      getTeamMembers: function(promiseFlag, cb){
        return promiseHandler(Restangular.all('teamMember').getList(), promiseFlag);
      },
      getTeams: function(promiseFlag, cb){
        return promiseHandler(Restangular.all('team').getList(), promiseFlag);
      }
    };
  }
);

var promiseHandler = function(p, promiseFlag){
  if(promiseFlag === false){
    p.then(function(list){
      return list;
    });
  }
  else return p;
};
;
app.service('stateControl', function($state, $rootScope){
	return {
		toState: function(state){
			$rootScope.loading.timer = setTimeout(function(){
			  $rootScope.loading.status = true;
			  console.log("Loading...");
			}, 500);

			$state.go(state);
		}
	};
});