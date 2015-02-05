var wikiPage = angular.module('wikiPage', []);

wikiPage.directive("wikiPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/wiki-pane.html',
		controller: function($http,$scope){
            


		},
		controllerAs: 'wikiCntrl'
	};
});



