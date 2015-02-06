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

            // $scope.myData = {
            // 	want: "GO TO YOGA MORE OFTEN",
            // 	because: "it makes me feel amazing, calms me down, and helps me find balance.",
            // 	then: "someone who feels like a strong physical machine ready to take on the world!",
            // 	workshops: [false,false,false,false,false],
            //     blurb: ["_blank_","_blank_","_blank_","_blank_","_blank_","_blank_","_blank_"]
            // };
            $scope.myData = {
                want: "",
                because: "",
                then: "",
                workshops: [false,false,false,false,false],
                blurb: ["_blank_","_blank_","_blank_","_blank_","_blank_","_blank_","_blank_"]
            };

            data = {
                uID: 'travis',
            };
            _HTTP("get", "goal", data, function(result){
                // $scope.getuser_result = result;
                // updateAllUsers();
                console.log(result)
                console.log(JSON.parse(result)) ;
                $scope.myData = JSON.parse(result);
                $scope.$apply();
            }); 

            // $scope.partnerData = {
            // 	'want': "",
            // 	'because': "",
            // 	'then': "",
            // 	'then': "",
            // 	'workshop': [false,false,false,false,false],
            //     'blurb': ["","","","","","",""]
            // };

            var workshopSelected = function(workshops){
				for (var i = 0; i < workshops.length; i++) {
				    if (workshops[i] == true) {
				        return true;
				    }
				}
				return false;
			}


            this.save = function(){
                console.log($scope.myData);
                data = {
                    uID: 'travis',
                    goal: JSON.stringify($scope.myData)
                };
                _HTTP("post", "goal", data, function(result){
                    // $scope.getuser_result = result;
                    // updateAllUsers();
                    console.log(JSON.parse(result['goal']));
                    $scope.$apply();
                }); 
            };


		},
		controllerAs: 'teamCntrl'
	};
});



