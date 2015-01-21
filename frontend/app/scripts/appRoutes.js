var ngRoute = require('angular-route');

var appRoutes = angular.module('appRoutes', ['ngRoute']);

angular.module('appRoutes').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: './templates/landingPage.html',
		})
		.when('/about',{
			templateUrl: './templates/aboutPage.html',
		})
		.otherwise({
			redirectTo: '/'
		});

	// use the HTML5 History API
	$locationProvider.html5Mode(true);
}]);
