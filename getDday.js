
function getDday(){
  var startDay = new Date("May 28, 2020 18:00:00").getTime();
  var today = new Date().getTime();
  var dday=Math.floor((today-startDay)/(1000*60*60*24));
  return dday;
}