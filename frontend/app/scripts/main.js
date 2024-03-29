var angular = require('angular'); // That's right! We can just require angular as if we were in node, thanks to browserify

var appRoutes = require('./appRoutes');
var landingPage = require('../modules/landing/landingPage');
var examplePage = require('../modules/example/examplePage');
var teamPage = require('../modules/team/teamPage');
var adminPage = require('../modules/admin/adminPage');
var wikiPage = require('../modules/wiki/wikiPage');
var surveyPage = require('../modules/survey/surveyPage');

var app = angular.module('bitbybitApp', ['appRoutes', 'ngFitText','landingPage', 'teamPage', 'adminPage', 'examplePage', 'wikiPage', 'surveyPage']);



app.directive('watchResize', function(){
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      angular.element(window).on('resize', function(){
        if(window.innerWidth<900){
          scope.mobile = true;
        }else{
          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {
            scope.mobile = false;
          }
        }
        scope.$apply();
        // console.log(scope.mobile);
      });
    }
  };
});

app.directive("loadingAnimation", function(){
  return{
    restrict: 'E',
    templateUrl: '/templates/loadingAnimation.html',
    controller: function($scope,$rootScope){
    },
    controllerAs: 'loadingAnimationCntrl'
  };
});

app.controller('bodyCntrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  if(window.innerWidth<900){
    $scope.mobile = true;
  }else{
    $scope.mobile = false;
  }
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   $scope.mobile = true;
  }

  f=navigator.userAgent.search("Firefox");

  if (f>-1){
      $scope.firefox = true;
  }


}]);

app.directive('contenteditable', function() {
      return {
          require: 'ngModel',
          link: function(scope, elm, attrs, ctrl) {
              // view -> model
              
              // elm.bind('keydown', function() {
              //   if(!scope.mobile){
              //     scope.$apply(function() {
              //         if((elm.html().split("_").length - 1) != elm.html().length){
              //           elm.html(elm.html().replace(/_/g,"")) ;
              //         }
              //         ctrl.$setViewValue(elm.html());    
              //     }); 
              //   }
                 
                 
              // });

              elm.bind('blur', function() {
                  scope.$apply(function() {
                      if (elm.html() === ""){
                        elm.html("____");
                      // }else if(elm.html() != "____"){
                      }else if((elm.html().split("_").length - 1) != elm.html().length){
                        elm.html(elm.html().replace(/_/g,"")) ;
                      }
                        ctrl.$setViewValue(elm.html());
                       
                  });
              });

              // model -> view
              ctrl.$render = function() {
                  elm.html(ctrl.$viewValue);
              };

              // load init value from DOM
              // ctrl.$setViewValue(elm.html());
              ctrl.$render();
              // scope.unsaved = true;
          }
      };
  });

// The following two functions are just abstracting the HTTP call process.
// These can be isolated in their own js file later, but for simplicity, I put them here.
getQueryString = function(obj) {
  var j, k, s, v;
  s = [];
  for (k in obj) {
    v = obj[k];
    if (v) {
      if (typeof v === "string") {
        if (String(v).split(",").length > 1 && v.split("{").length < 2) {
          j = 0;
          while (j < v.split(",").length) {
            s.push(encodeURIComponent(k) + "=" + encodeURIComponent(v.split(",")[j]));
            j++;
          }
        } else {
          s.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      } else {
        s.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
  }
  return s.join("&");
};

_HTTP = function(method, entity, data, callback) {
  var url, xhr;
  
  var base_url = 'http://bitxbit.media.mit.edu/api/private';
  //var base_url = 'http://localhost.media.mit.edu:5000/api/private';
  
  if (method === 'post' || method === 'put') {
    url = base_url + "/" + entity;
    xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.withCredentials = true;
    xhr.onload = function(resp) {
      return callback(JSON.parse(resp.target.responseText));
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    return xhr.send(getQueryString(data));
  } else {
    url = base_url + "/" + entity + "?" + getQueryString(data);
    xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.withCredentials = true;
    xhr.onload = function(resp) {
      return callback(JSON.parse(resp.target.responseText));
    };
    xhr.open(method, url, true);
    return xhr.send();
  }
};