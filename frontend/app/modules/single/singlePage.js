var singlePage = angular.module('singlePage', []);

singlePage.directive("singlePane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/single-pane.html',
		controller: function($http,$scope){
            $scope.dateNotChecked=false;


            this.func = function(cat){
                alert(cat);
            }

            this.validate = function(){
                alert(cat);
            }
		},
		controllerAs: 'singleCntrl'
	};
});

