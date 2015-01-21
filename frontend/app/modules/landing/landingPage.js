var landingPage = angular.module('landingPage', []);

landingPage.directive("landingPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/landing-pane.html',
		controller: function($http,$scope){
			var updateAllUsers = function(){
				_HTTP("get", "allusers", {}, function(results){
			    	var allUsers = [];
			    	angular.forEach(results, function(user){
			    		allUsers.push(user);
			    	});
			    	$scope.allUsers = allUsers;
			    	$scope.$apply();
			    }); 
			}

			updateAllUsers();

			this.addUser = function(uID){
				data = {
					uID: uID
				};
			    _HTTP("post", "user", data, function(result){
			    	$scope.adduser_result = result;
			    	updateAllUsers();
			    	$scope.$apply();
			    });	 
			};

			this.getUser = function(uID){
				data = {
					uID: uID
				};
			    _HTTP("get", "user", data, function(result){
			    	$scope.getuser_result = result;
			    	updateAllUsers();
			    	$scope.$apply();
			    }); 
			};
			this.deleteUser = function(uID){
				data = {
					uID: uID
				};
			    _HTTP("delete", "user", data, function(result){
			    	$scope.deleteuser_result = result;
			    	updateAllUsers();
			    	$scope.$apply();
			    }); 
			};

			this.addGoal = function(uID, goal){
				data = {
					uID: uID,
					goal: goal
				};
			    _HTTP("post", "goal", data, function(result){
			    	$scope.addgoal_result = result;
			    	updateAllUsers();
			    	$scope.$apply();
			    }); 
			};

			this.getGoal = function(uID){
				data = {
					uID: uID
				};
			    _HTTP("get", "goal", data, function(result){
			    	$scope.getgoal_result = result;
			    	updateAllUsers();
			    	$scope.$apply();
			    }); 
			};

			this.deleteGoal = function(uID){
				data = {
					uID: uID
				};
			    _HTTP("delete", "goal", data, function(result){
			    	$scope.deletegoal_result = result;
			    	updateAllUsers();
			    	$scope.$apply();
			    }); 
			};
					
		},
		controllerAs: 'landingCntrl'
	};
});

