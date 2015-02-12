var adminPage = angular.module('adminPage', []);

adminPage.directive("adminPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/admin-pane.html',
		controller: function($http,$scope){

            $scope.feedback = "Send a response to this participant";

            $scope.responseArray = [
                {
                    want: "GO TO YOGA MORE OFTEN",
                    because: "it makes me feel amazing, calms me down, and helps me find balance.",
                    then: "someone who feels like a strong physical machine ready to take on the world!",
                    blurb: ["_blank_","_blank_","_blank_","_blank_","_blank_","_blank_","_blank_"]
                },
                {
                    want: "FUCK YOUR MOTHER",
                    because: "fuck you",
                    then: "giggity",
                    blurb: ["fuck","fuck","fuck","fuck","fuck","fuck","fuck"]
                },
                {
                    want: "bang everyone",
                    because: "giggity",
                    then: "hot damn",
                    blurb: ["fuck","fuck","fuck","fuck","fuck","fuck","fuck"]
                },
                ];

            $scope.image='http://pldb.media.mit.edu/research/images/nophoto.gif'

            //data = {
            //};
            //_HTTP("get", "admindata", data, function(result){
            //    if(result =="redirect"){
            //        window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
            //    }else{
            //        $scope.name = result['name']
            //        $scope.image = result['image']
            //        goal = result['goal'];
            //        if (goal != false){
            //            $scope.myData = result['goal'];
            //        }
            //        $scope.$apply();
            //    }
            //});




            //    data = {
            //        goal: JSON.stringify($scope.myData)
            //    };
            //    _HTTP("post", "adminemail", data, function(result){
            //        if(result =="redirect"){
            //        window.location.href = 'http://www.media.mit.edu/login?destination=http://bitxbit.media.mit.edu/team&previous=http://bitxbit.media.mit.edu';
            //        }else{
            //            try{
            //            }catch(err){
            //            }
            //        }
            //    });
            //};


		},
		controllerAs: 'adminCntrl'
	};
});



