var landingPage = angular.module('landingPage', []);

landingPage.directive("landingPane", function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/landing-pane.html',
		controller: function($http,$scope){
			 


		    var counter = 0;

		    function switch_examples() {
		    	try{
			    	var showPair = document.getElementsByClassName('visible')[0];
			    	showPair.className = "set visible out";
			    	setTimeout(function(){
			    		showPair.className = "set";
			    	},1000)

			    	// console.log(document.getElementsByClassName('set'));
			    	var newPair = document.getElementsByClassName('set')[counter];
			    	// console.log(newPair);
			    	newPair.className = "set visible";
				    counter = (counter+1)%3;
			  	}catch(err){
			   		x = 0;	
			  	}
		    	
		    };

		    setInterval(switch_examples, 5000);
		 
		 	backgroundCounter = 1;
		    function switch_background(){
		    	try{
		    		var background = document.getElementsByClassName('banner')[0]
			    	background.style.background = "url('/images/superhero"+backgroundCounter+".jpg') no-repeat center center";
			    	background.style.backgroundSize= "cover";
			    	backgroundCounter = (backgroundCounter+1)%3;
		    	}catch(err){
		    		x = 0;
		    	}
		    	
		    };
		    setInterval(switch_background, 10000);
		  	
					
		},
		controllerAs: 'landingCntrl'
	};
});

