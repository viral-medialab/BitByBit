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
                    want: "LOADING...",
                    because: "LOADING...",
                    then: "LOADING...",
                    blurb: ["_blank_","_blank_","_blank_","_blank_","_blank_","_blank_","_blank_"]
                }
                ];

            $scope.numResponses = $scope.responseArray.length;
            $scope.feedbackDisplayed = [];
            for (var i=0;i++;i < $scope.numResponses){
                $scope.feedbackDisplayed.push(false);
            }
            $scope.participantDisplayed = [true];
            for (var i=0;i++;i < $scope.numResponses-1){
                $scope.participantDisplayed.push(false);
            }


            data = {
            };
            _HTTP("get", "admindata", data, function(result){
               if(result =="redirect"){
                   window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
               }else{
                   $scope.responseArray = result;

                   $scope.numResponses = $scope.responseArray.length;
                   $scope.feedbackDisplayed = [];
                   for (var i=0;i++;i < $scope.numResponses){
                       $scope.feedbackDisplayed.push(false);
                   }
                   $scope.participantDisplayed = [true];
                   for (var i=0;i++;i < $scope.numResponses-1){
                       $scope.participantDisplayed.push(false);
                   }

                   $scope.$apply();
                   console.log( $scope.responseArray)

               }
            });



            this.send = function(uID, idx){
                alert("trying to send " + $scope.feedback[idx] + " to user " + uID + " from box " + idx);
                data = {
                    uID: uID,
                    message: $scope.feedback[idx]
                };
               _HTTP("post", "adminemail", data, function(result){
                   if(result =="redirect"){
                     window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
                   }else{
                        console.log(result);
                        // this.approve(idx);

                   }
               });
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
                if (idx < $scope.numResponses) {
                    $scope.participantDisplayed[idx+1] = true;
                }
            }


		},
		controllerAs: 'adminCntrl'
	};
});



