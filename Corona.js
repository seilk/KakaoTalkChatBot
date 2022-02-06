function getCorona(){
  var site = Utils.getWebText("http://ncov.mohw.go.kr/");
  var data = site.split("occurrenceStatus")[1];
  data = data.replace(/<[^>]+>/g,"");
  data = data.trim().replace(/\s+/g," ").split("\n")[0];
  data = data.split("다운로드")[0].trim();
  data = data.split("일일");
  var peoples = data[2].trim();
  peoples = peoples.split(" ");
  avgSevenDays = peoples.join(" ").trim().split("7일간일평균")[1].trim().split("(누적)")[0].trim().split(" ");
  var totPeoples = []
  totPeoples[0] = peoples.join(" ").trim().split("7일간일평균")[1].trim().split("(누적)")[1].trim(); 
  totPeoples[1] = peoples.join(" ").trim().split("7일간일평균")[1].trim().split("(누적)")[2].trim(); 

  var results = [];
  var dayInfo = getDate();
  results[0] = "--"+dayInfo.join(".")+" 코로나 확진자--"
  results[1] = "🔴확진 : " + peoples[3]+"명";
  results[2] = "💀사망 : " + peoples[0]+"명";
  results[3] = ""
  results[4] = "--최근 7일간 일평균--";
  results[5] = "🔴확진 : "+avgSevenDays[3]+"명";
  results[6] = "💀사망 : "+avgSevenDays[0]+"명";
  results[7] = "";
  results[8] = "--누적--";
  results[9] ="💀"+totPeoples[0]+"명";
  results[10] ="🔴"+totPeoples[1]+"명";
  var res = results.join("\n");
  return res
}

if(dict_cmd[msg]=="/코로나"){
  var res = getCorona();
  replier.reply(res);
  return
}