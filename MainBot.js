/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
const scriptName = "Weather";

function isNaN(val){
  const n = Number(val);
  return n!==n;
}

function recompile_bot_func(){
  let compile_result = Api.compile("Weather");
  if(compile_result == true){
    return "Compile Complete";
  }
  else{
    return "Compile Failed";
  }
}
//현재 시간 관리
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

//중복 응답 관리
function dict_init(dict_cmd){
  dict_cmd["/날씨"]=dict_cmd["/미세먼지"]="/날씨 서울";
  //
  dict_cmd["/시크릿쥬쥬"]
  =dict_cmd["/시크릿쥬쥬비행기"]
  =dict_cmd["/쥬쥬"]
  =dict_cmd["/찬웅게이야"]
  ="/시크릿쥬쥬비행기"
  //
  dict_cmd["/개추"]
  =dict_cmd["/개추한번눌러볼까?"]
  =dict_cmd["/개추한번눌러볼까"]
  =dict_cmd["/개추한번"]
  ="/개추"
  //
  dict_cmd["/코로나"]
  =dict_cmd["/확진자"]
  =dict_cmd["/코로나확진자수"]
  =dict_cmd["/확진"]
  =dict_cmd["/야로나"]
  =dict_cmd["/씹로나"]
  =dict_cmd["/ㅋㄹㄴ"]
  =dict_cmd["/로나"]
  ="/코로나"
}

//코로나 확진자 수
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

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  msg = msg.trim();
  var str_split_Arr=[]
  str_split_Arr=msg.split(" ");
  let dict_cmd = {};
  dict_init(dict_cmd);

  if (str_split_Arr[0]=="/hello"){
    replier.reply("안녕하세요. 날씨를 확인하고 싶으시면 \"/날씨 (지역명)\" 혹은 \"/날씨\"를 입력하세요.")
    return;
  }

  else if (str_split_Arr[0]=="/bye"){
    replier.reply("저를 보내지 말아요.")
    return;
  }

  else if(str_split_Arr[0].trim()=="/compile"){
    replier.reply(recompile_bot_func());
    return;
  }
  //코로나
  else if(dict_cmd[msg]=="/코로나"){
    var res = getCorona();
    replier.reply(res);
    return
  }
  //날씨
  else if (str_split_Arr[0] == "/날씨"){
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

  //시크릿쥬쥬
  else if(dict_cmd[msg]=="/시크릿쥬쥬비행기"){
    replier.reply("다 준비 되셨으면 출발해볼까요~ 치링치링 치리링~");
    return;
  }

  //개추
  else if(dict_cmd[msg]=="/개추"){
    replier.reply("날씨 눈나 좋으면 개 추 한번 눌러볼까?");
    return;
  }

  //아직 없는 명령어
  else if (msg[0]==="/"){
    replier.reply("아직 없는 명령어예요. 원하시는 명령을 개발자에게 직접 알려주세요!");
    return;
  }
  
}