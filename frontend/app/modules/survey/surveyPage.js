var surveyPage = angular.module('surveyPage', []);

surveyPage.directive("surveyPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/survey-pane.html',
		controller: function($http,$scope){

            $scope.survey_num = "0";

            $scope.timeUnits = [
                "times",
                "hours"
            ];

            $scope.calendarUnits = [
                "day",
                "week",
                "month",
                "year"
            ];

            $scope.myData = {
                want: "____",
                because: "____",
                then: "____",
                workshops: [false,false,false,false,false],
                blurb: ["____","____","____","____","____","____","____"]
            };
            $scope.partnerData = {
                want: "____",
                because: "____",
                then: "____",
                workshops: [false,false,false,false,false],
                blurb: ["____","____","____","____","____","____","____"],
                design_01: 'Awaiting Partner Input',
                design_02: 'Awaiting Partner Input',
                design_03: 'Awaiting Partner Input',
                design_04: 'Awaiting Partner Input',
                design_05: 'Awaiting Partner Input',
                design_06: 'Awaiting Partner Input',
                design_07: 'Awaiting Partner Input',
                design_08: 'Awaiting Partner Input'
            };
            $scope.surveyData = {
                nowNum: 5,
                nowTimeUnit: $scope.timeUnits[0],
                nowCalendarUnit: $scope.calendarUnits[0],
                affect: -1,
                wantNum: 5,
                wantTimeUnit: $scope.timeUnits[0],
                wantCalendarUnit: $scope.calendarUnits[0],
                progress: -1,
                confidence: -1,
                tiny: false,
                specific: false,
                environment: false,
                trigger: false,
                considersAffect: false
            };

            $scope.image='http://pldb.media.mit.edu/research/images/nophoto.gif';
            $scope.partnerImage='http://pldb.media.mit.edu/research/images/nophoto.gif';
            data = {
            };
            _HTTP("get", "goal", data, function(result){
                // $scope.getuser_result = result;
                // updateAllUsers();
                // console.log(result);
                // console.log(JSON.parse(result)) ;
                if(result =="redirect"){
                    window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/survey&previous=http://bitxbit.media.mit.edu';

                }else{
                    $scope.name = result['name']
                    $scope.image = result['image']
                    // console.log(result)
                    goal = result['goal'];
                    if (goal != false){
                        $scope.myData = result['goal'];
                    }

                    $scope.partnerName = result['partner']['name']
                    $scope.partnerEmail = result['partner']['email']
                    $scope.partnerImage = result['partner']['image']
                    $scope.partnerData = result['partner']['goal']

                    $scope.$apply();
                }

            });

            data = {
                survey_num: $scope.survey_num
            };
            _HTTP("get", "survey", data, function(result){
                $scope.surveyData = result['survey'];
                $scope.$apply();
            });

            $scope.updatingProject = false;
            $scope.updatedProject = false;
            $scope.updatedError = false;
            $scope.showModal = false;


            this.closeModal = function(){
                $scope.showModal = false;
            }
            this.save = function(){
                // console.log($scope.unsaved);
                $scope.updatingProject = true;
                $scope.updatedProject = false;
                $scope.updatedError = false;

                data = {
                    survey: JSON.stringify($scope.surveyData),
                    survey_num: $scope.survey_num
                };
                _HTTP("post", "survey", data, function(result){
                    if(result =="redirect"){
                        window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/survey&previous=http://bitxbit.media.mit.edu';
                    }else if(result == "noChange"){
                        var y = 0;
                    }else{
                        try{
                            result['survey']
                            $scope.updatingProject = false;
                            $scope.updatedProject = true;
                            $scope.updatedError = false;
                            // $scope.unsaved = false;
                            $scope.$apply();
                            setTimeout(function(){
                                $scope.updatingProject = false;
                                $scope.updatedProject = false;
                                $scope.updatedError = false;
                                $scope.$apply();
                            },5000);
                            $scope.showModal = true;
                            setTimeout(function(){
                                $scope.updatingProject = false;
                                $scope.updatedProject = false;
                                $scope.updatedError = false;
                                $scope.showModal = false;
                                $scope.$apply();
                            },3000);
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
                    }
                });
            };


		},
		controllerAs: 'surveyCntrl'
	};
});



