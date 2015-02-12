var adminPage = angular.module('adminPage', []);

adminPage.directive("adminPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/admin-pane.html',
		controller: function($http,$scope){

            $scope.feedback = {};

            $scope.responseArray = [
                {
                    uID: "user1",
                    want: "GO TO YOGA MORE OFTEN",
                    because: "it makes me feel amazing, calms me down, and helps me find balance.",
                    then: "someone who feels like a strong physical machine ready to take on the world!",
                    blurb: ["_blank_","_blank_","_blank_","_blank_","_blank_","_blank_","_blank_"]
                },
                {
                    uID: "user2",
                    want: "laser eyes",
                    because: "cool",
                    then: "pew pew pew",
                    blurb: ["pew","pew","pew","pew","pew","pew","pew"]
                },
                {
                    uID: "user3",
                    want: "fuck",
                    because: "fuck",
                    then: "fuckfuckfuck",
                    blurb: ["fuck","fuck","fuck","fuck","fuck","fuck","fuck"]
                },
                ];

            var numResponses = $scope.responseArray.length;
            $scope.feedbackDisplayed = [];
            for (var i=0;i++;i < numResponses){
                $scope.feedbackDisplayed.push(false);
            }
            $scope.participantDisplayed = [true];
            for (var i=0;i++;i < numResponses-1){
                $scope.participantDisplayed.push(false);
            }


            data = {
            };
            //_HTTP("get", "admindata", data, function(result){
            //    if(result =="redirect"){
            //        window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
            //    }else{
            //        $scope.responseArray = result;
            //        $scope.$apply();
            //    }
            //});



            this.send = function(uID, idx){
                alert("trying to send " + $scope.feedback[idx] + " to user " + uID + " from box " + idx);
                data = {
                    uID: uID,
                    message: $scope.feedback[idx]
                };
            //    _HTTP("post", "adminemail", data, function(result){
            //        if(result =="redirect"){
            //          window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
            //        }else{
            //            this.approve(idx);
            //        }
            //    });
            };

            this.flag = function(idx) {
                if ($scope.feedbackDisplayed[idx]){
                    this.approve(idx);
                }
                else {
                    $scope.feedbackDisplayed[idx] = true;
                    $scope.feedback[idx] = "Send a message to this participant";
                }
            }

            this.approve = function(idx) {
                $scope.participantDisplayed[idx] = false;
                if (idx < numResponses) {
                    $scope.participantDisplayed[idx+1] = true;
                }
            }


		},
		controllerAs: 'adminCntrl'
	};
});



