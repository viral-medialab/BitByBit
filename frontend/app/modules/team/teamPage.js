var teamPage = angular.module('teamPage', []);

teamPage.directive("teamPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/team-pane.html',
		controller: function($http,$scope){
            $scope.workshops = [false,false,false,false,false];
            $scope.need = "";
            $scope.insight = "";
            $scope.problem = ""

            $scope.myData = {
            	'want': "",
            	'because': "",
            	'then': "",
            	'workshops': [false,false,false,false,false],
                'blurb': ["","","","","","",""]
            };

            $scope.partnerData = {
            	'want': "",
            	'because': "",
            	'then': "",
            	'then': "",
            	'workshop': [false,false,false,false,false],
                'blurb': ["","","","","","",""]
            };

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
            };

            this.save = function(){
                console.log('hi');
                console.log($scope.myData);
            };


		},
		controllerAs: 'teamCntrl'
	};
});



