var adminPage = angular.module('adminPage', []);

adminPage.directive("adminPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/admin-pane.html',
		controller: function($http,$scope){

            $scope.feedback = {};
            $scope.checkall = true;

            $scope.responseArray = [
                {
                    uID: "user1",
                    want: "LOADING...",
                    because: "LOADING...",
                    then: "LOADING...",
                    blurb: ["_blank_","_blank_","_blank_","_blank_","_blank_","_blank_","_blank_"]
                }
                ];


            data = {
            };
            _HTTP("get", "admindata", data, function(result){
               if(result =="redirect"){
                   window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
               }else{
                    console.log(result)
                   $scope.responseArray = result;

                   $scope.numResponses = $scope.responseArray.length;
                    $scope.feedbackDisplayed = $scope.responseArray.map(function() {
                        return false;
                    });
                    $scope.participantDisplayed = $scope.responseArray.map(function(val,i) {
                        return true;
                    });
                    $scope.participantApproved = $scope.responseArray.map(function(val,i) {
                        return false;
                    });
                    $scope.participantDisapproved = $scope.responseArray.map(function(val,i) {
                        return false;
                    });


                   $scope.$apply();
                   console.log( $scope.responseArray)

               }
            });



            this.send = function(uID, idx){

                //alert("trying to send " + $scope.feedback[idx] + " to user " + uID + " from box " + idx);
                data = {
                    uID: uID,
                    message: escape($scope.feedback[idx])
                };
                // console.log(data)
                // console.log ($scope.feedback)
                // console.log (escape($scope.feedback[idx]))
               _HTTP("post", "adminemail", data, function(result){
                   if(result =="redirect"){
                     window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
                   }else{
                        console.log(result);
                        if (!$scope.checkall){
                            $scope.participantDisplayed[idx] = false;
                            if (idx < $scope.numResponses) {
                                $scope.participantDisplayed[idx+1] = true;
                            }
                        }
                        $scope.$apply();

                   }
               });
               $scope.participantDisapproved[idx] = true;
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

            this.approve = function(uID,idx) {
                if (!$scope.checkall){
                    $scope.participantDisplayed[idx] = false;
                    if (idx < $scope.numResponses) {
                        $scope.participantDisplayed[idx+1] = true;
                    }
                }
                $scope.participantApproved[idx] = true;

                data = {
                    uID: uID
                };
                _HTTP("post", "adminapprove", data, function(result){
                   if(result =="redirect"){
                     window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
                   }else{
                        console.log(result);
                   }
               });
            }

            this.checkAll = function() {
                $scope.checkall = !$scope.checkall;
                $scope.participantDisplayed = $scope.participantDisplayed.map(function() {
                    return $scope.checkall;
                });
                $scope.participantDisplayed[0] = true;
                $scope.$apply();

            }


		},
		controllerAs: 'adminCntrl'
	};
});



