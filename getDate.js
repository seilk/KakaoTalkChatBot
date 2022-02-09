function getDate(){
  let today = new Date();
  var infos = [];
  var dayOfWeeks = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  infos[0] = today.getFullYear();
  infos[1] = today.getMonth()+1;
  infos[2] = today.getDate();
  infos[3] = dayOfWeeks[today.getDay()]; 
  return infos;
}