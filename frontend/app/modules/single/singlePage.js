var singlePage = angular.module('singlePage', []);

singlePage.directive("singlePane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/single-pane.html',
		controller: function($http,$scope){
            $scope.workshops = [false,false,false,false,false];
            $scope.need = "";
            $scope.insight = "";
            $scope.problem = ""

            var workshopSelected = function(workshops){
				for (var i = 0; i < workshops.length; i++) {
				    if (workshops[i] == true) {
				        return true;
				    }
				}
				return false;
			}

            this.submit = function(need, insight, problem, workshops){
                var hasworkshop = workshopSelected(workshops)
                if(need.length >= 1 && insight.length >= 1 && problem.length >= 1 && hasworkshop) {
                    alert("submitting " + need + insight + problem + workshops);
                }
            }


		},
		controllerAs: 'singleCntrl'
	};
});



