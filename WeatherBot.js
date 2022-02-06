//내일날씨 함수
function getTomorrowWeatherInfo(tpos){
  try{
    var data = Utils.getWebText("https://m.search.naver.com/search.naver?query="+tpos+"%20날씨");
    data = data.replace(/<[^>]+>/g,""); //태그 삭제
    data = data.split("내일의 날씨")[1]; //날씨 정보 시작 부분의 윗부분 삭제
    data = data.split("시간별 예보")[0]; //날씨 정보 끝 부분의 아래쪽 부분 삭제
    data = data.trim(); //위아래에 붙은 불필요한 공백 삭제
    data = data.replace(/\s+/g," ");
    data = data.split("\n"); //엔터 단위로 자름
    data = data[0].split(" ")
    TemperatureAM = parseInt(data[3].replace("온도","").trim().slice(0,data.length-1));
    infoAM = data[1];
    RainAM = data[6].trim();
    DustAM = data[8].trim();
    sDustAM = data[10].trim();

    TemperaturePM = parseInt(data[14].replace("온도","").trim().slice(0,data.length-1));
    infoPM = data[12].trim();
    RainPM = data[17].trim();
    DustPM = data[19].trim();
    sDustPM = data[21].trim();
    
    announcement = "내일 "+ tpos.slice(2,tpos.length)+"의 날씨는?"
    if (isNaN(TemperatureAM)){
        throw new NullPointException();
      }
    var results = [];
    results[0] = "<<오전>>" + "---" + "[" +infoAM+"]";
    results[1] = "기온 : "+TemperatureAM+"℃";
    results[2] = "강수확률 : "+RainAM;
    results[3] = "미세먼지 : "+DustAM;
    results[4] = "초미세먼지 : "+sDustAM;
    results[5] = " ";
    results[6] = "<<오후>>" + "---" + "[" +infoPM+"]";
    results[7] = "기온 : "+TemperaturePM+"℃";
    results[8] = "강수확률 : "+RainPM;
    results[9] = "미세먼지 : "+DustPM;
    results[10] = "초미세먼지 : "+sDustPM;
    results.splice(0,0,announcement);
    var res = results.join("\n");
    return res;}
  catch(e){
    return null;
  }
}

//오늘날씨 함수
function getWeatherInfo(pos) {
  try{
    var data = Utils.getWebText("https://m.search.naver.com/search.naver?query="+pos+"%20날씨");
    data = data.replace(/<[^>]+>/g,""); //태그 삭제
    data = data.split("오늘의 날씨")[1]; //날씨 정보 시작 부분의 윗부분 삭제
    data = data.split("시간별 예보")[0]; //날씨 정보 끝 부분의 아래쪽 부분 삭제
    data = data.trim(); //위아래에 붙은 불필요한 공백 삭제
    data = data.replace(/\s+/g," ");
    data = data.split("\n")[0]; //엔터 단위로 자름
    data = data.split(" ");
    Temperature = parseInt(data[2].replace("온도","").slice(0,data.length-1).trim());
    if (isNaN(Temperature)){
      throw new NullPointException()
    }
    var results = [];
    results[0] = "현재온도 : "+Temperature+"℃";
    results[1] = "어제보다 " + data[4].slice(0,data.length-3).trim() +"C"+ " " + data[5].trim();
    results[2] = data[13].trim() + " : "+data[14].trim(); //미세
    results[3] = data[15].trim() + " : "+data[16].trim();  //초미세
    results[4] = "습도 : " +data[10].trim();
    results[5] = "바람 : " +data[12].trim(); 
    results[6] = data[17].trim()+ " : " +data[18].trim(); //자외선
    results[7] = data[19].trim()+ " : " + data[20].trim(); //일몰
    var result = "[" + pos + " 날씨/미세먼지 정보] "+"\n!!"+data[0]+"!!\n"+results.join("\n");
    return result; //결과 반환
  }catch(e){
    return null;
  }
}

//응답
if (str_split_Arr[0] == "/날씨"){
  //오사카 이스터에그
  if (str_split_Arr.length > 1 && str_split_Arr[1].trim()=="오사카"){
    replier.reply("나츠키님한테 직접 물어보세요. 간현상");
    return;
  }

  //내일 날씨
  else if (str_split_Arr.length > 1 && str_split_Arr[1].indexOf("내일")==0){
    var pos = str_split_Arr[1].length < 3 ? str_split_Arr[1] : "내일서울";
    var result=getTomorrowWeatherInfo(pos.trim());
    if (result==null){
      replier.reply(pos + "의 날씨 정보를 가져올 수 없습니다. 올바른 형식을 확인해주세요.");
      return;
    }
    replier.reply(result);
    return;
  }
  //오늘 날씨
  var pos = str_split_Arr.length > 1 ? str_split_Arr[1] : "서울";
  var result = getWeatherInfo(pos.trim());
  if(result == null) {
    replier.reply(pos + "의 날씨 정보를 가져올 수 없습니다. 올바른 형식을 확인해주세요.");
    return;
  }
  replier.reply(result);
  return;
}