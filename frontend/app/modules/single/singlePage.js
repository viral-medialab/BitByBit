var singlePage = angular.module('singlePage', []);

singlePage.directive("singlePane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/single-pane.html',
		controller: function($http,$scope){
            var test="hi";
		},
		controllerAs: 'singleCntrl'
	};
});

