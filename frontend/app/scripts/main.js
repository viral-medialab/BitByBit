var angular = require('angular'); // That's right! We can just require angular as if we were in node, thanks to browserify

var appRoutes = require('./appRoutes');
var landingPage = require('../modules/landing/landingPage');
var teamPage = require('../modules/team/teamPage');
var wikiPage = require('../modules/wiki/wikiPage');

var app = angular.module('bitbybitApp', ['appRoutes', 'ngFitText','landingPage', 'teamPage', 'wikiPage']);



app.directive('watchResize', function(){
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      angular.element(window).on('resize', function(){
        if(window.innerWidth<900){
          scope.mobile = true;
        }else{
          scope.mobile = false;
        }
        scope.$apply();
        // console.log(scope.mobile);
      });
    }
  }
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


}]);

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
  // var base_url = 'https://www.bitbybit.me/api';
  var base_url = 'http://localhost:5000/api';
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