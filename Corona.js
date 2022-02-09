function getCorona(){
  var a = org.jsoup.Jsoup.connect("http://m.naver.com").get();
  var b = a.select(".cbc_term").text().split(" ")
  var c = a.select(".cbc_number").text().split(" ")
  var results = [];
  var dayInfo = getDate();
  results[0] = "<<"+dayInfo.join(".")+">>"
  results[1] = "🔴신규확진자 : "+c[0]+"명";
  results[2] = "💉2차 접종률 : "+c[1];
  results[3] = "💉3차 접종률 : "+c[2];
  var res = results.join("\n");
  return res
}
if(dict_cmd[msg]=="/코로나"){
  var res = getCorona();
  replier.reply(res);
  return
}