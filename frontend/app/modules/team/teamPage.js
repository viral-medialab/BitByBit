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
                want: "____",
                because: "____",
                then: "____",
                workshops: [false,false,false,false,false],
                blurb: ["____","____","____","____","____","____","____"]
            };

            data = {
            };
            _HTTP("get", "goal", data, function(result){
                // $scope.getuser_result = result;
                // updateAllUsers();
                console.log(result)
                // console.log(JSON.parse(result)) ;
                $scope.name = result['name']
                $scope.image = result['image']
                goal = JSON.parse(result['goal']);
                if (goal != false){
                    $scope.myData = JSON.parse(result['goal']);
                }
                
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

            $scope.updatingProject = false;
            $scope.updatedProject = false;
            $scope.updatedError = false;

            this.save = function(){
                $scope.updatingProject = true;
                $scope.updatedProject = false;
                $scope.updatedError = false;

                data = {
                    goal: JSON.stringify($scope.myData)
                };
                _HTTP("post", "goal", data, function(result){
                    // $scope.getuser_result = result;
                    // updateAllUsers();
                    try{
                        JSON.parse(result['goal'])
                        $scope.updatingProject = false;
                        $scope.updatedProject = true;
                        $scope.updatedError = false;
                        $scope.$apply();
                        setTimeout(function(){
                            $scope.updatingProject = false;
                            $scope.updatedProject = false;
                            $scope.updatedError = false;
                            $scope.$apply();
                        },5000);
                    }catch(err){
                        $scope.updatingProject = false;
                        $scope.updatedProject = false;
                        $scope.updatedError = true;
                        $scope.$apply();
                        setTimeout(function(){
                            $scope.updatingProject = false;
                            $scope.updatedProject = false;
                            $scope.updatedError = false;
                            $scope.$apply();
                        },5000);
                    }
                    $scope.$apply();
                }); 
            };


		},
		controllerAs: 'teamCntrl'
	};
});



