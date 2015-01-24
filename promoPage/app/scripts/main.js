var list = ['example1','example2','example3'];
var index = 0;

var cycle = window.setInterval(function(){
  div = document.getElementById(list[index]);
  index = (index+1)%list.length;
  nextDiv = document.getElementById(list[index]);

  div.className = "example removing";
  nextDiv.className = "example visible";
  setTimeout(function(){
    div.className = "example hidden";
  },3000);
}, 10000);

