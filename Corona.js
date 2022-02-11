function getCorona(){
  var a = org.jsoup.Jsoup.connect("https://m.news.naver.com/covid19/index#infection-status").get();
  var b = a.select(".desc").text().toString().split(" ")
  var c = b[2].replace(/[/[ㄱ-ㅎㅏ-ㅣ가-힣]/g,"") //확진자 수
  var d = b[4]+"명 "+b[5] //증가, 감소분
  var results = [];
  var dayInfo = getDate();
  results[0] = "<<"+dayInfo.join(".")+">>"
  results[1] = "🔴신규확진자 : "+c+"명";
  results[2] = "🟠어제보다 "+d
  results[3] = "💉2차 접종률 : "+b[0];
  results[4] = "💉3차 접종률 : "+b[1];
  var res = results.join("\n");
  return res
}