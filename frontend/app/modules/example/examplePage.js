var examplePage = angular.module('examplePage', []);

examplePage.directive("examplePane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/example-pane.html',
		controller: function($http,$scope){
            
            $scope.workshops = [true,false,true,false,false];
            $scope.need = "";
            $scope.insight = "";
            $scope.problem = ""

            $scope.myData = {
            	'want': "",
            	'because': "",
            	'then': "",
            	'then': "",
            	'workshop': [false,false,false,false,false],
            	'blurb_0': "",
            	'blurb_1': "",
            	'blurb_2': "",
            	'blurb_3': "",
            	'blurb_4': "",
            };




		},
		controllerAs: 'exampleCntrl'
	};
});



