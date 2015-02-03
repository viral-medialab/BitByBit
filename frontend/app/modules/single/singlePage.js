var singlePage = angular.module('singlePage', []);

singlePage.directive("singlePane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/single-pane.html',
		controller: function($http,$scope){
            $scope.workshops = [false,false,false,false,false];
            $scope.need = "";
            $scope.insight = "";
            $scope.problem_description = ""

            $scope.noWorkshop=false;
            $scope.noProblem = false;
            $scope.noNeed = false;
            $scope.noInsight = false;
            $scope.invalid = true;

            this.submit = function(need,insight,problem_description,workshops){
                alert("submitting " + need + insight + problem_description + workshops);
            }

            this.validate = function(){
                $scope.noWorkshop = workshops == [false,false,false,false,false];
                $scope.noNeed = need == "";
                $scope.noInsight = insight=="";
                $scope.noProblem = problem_description=="";
                $scope.invalid = noNeed || noProblem || noWorkshop || noInsight;
            }
		},
		controllerAs: 'singleCntrl'
	};
});



