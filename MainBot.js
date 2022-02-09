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
  let compile_result = Api.compile("NEWS");
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
  =dict_cmd["/개로나"]
  =dict_cmd["/로나"]
  ="/코로나"
  //
  dict_cmd["/주가"]
  =dict_cmd["/ㅈㄱ"]
  =dict_cmd["/주식"]
  =dict_cmd["/ㅈㅅ"]
  =dict_cmd["/가격"]
  ="/주가"
  //
  dict_cmd["/모두에게"]
  =dict_cmd["/모두"]
  =dict_cmd["/everyone"]
  =dict_cmd["/ㅁㄷ"]
  ="/모두에게"
}

//d-day
function getDday(){
  var startDay = new Date("May 28, 2020 18:00:00").getTime();
  var today = new Date().getTime();
  var dday=Math.floor((today-startDay)/(1000*60*60*24));
  return dday+1;
}

//국내주식가격
function getStockInfo(name){
  try{
    let isIndex = {};
    isIndex["코스피"]=isIndex["ㅋㅅㅍ"]=isIndex["유가증권"]="코스피"
    isIndex["코스닥"]=isIndex["ㅋㅅㄷ"]="코스닥"
    if (isIndex[name]=="코스피"||isIndex[name]=="코스닥"){
      var url="https://www.google.com/search?q=%EC%A3%BC%EA%B0%80"+isIndex[name];
      var data = org.jsoup.Jsoup.connect(url).get();
      var indexNum = data.select("span[class=IsqQVc NprOob wT3VGc]").toString().trim().replace(/<[^>]+>/g,"");
      var indexCompareYesterday = data.select("span[jsname=qRSVye]").toString().trim().replace(/<[^>]+>/g,"").split("\n")[0];
      var indexCompareYesterdayRate = data.select("span[jsname=rfaVEf]").toString().trim().replace(/<[^>]+>/g,"").split("\n")[0];
      var upOrDown= (indexCompareYesterday[0]!="-")?"▲":"▼";
      var indexInfo=[];
      indexInfo[0] = "현재 "+ isIndex[name] + "정보🤔";
      indexInfo[1] = isIndex[name]+ " : " +indexNum
      indexInfo[2] = "전일대비 : "+indexCompareYesterday+indexCompareYesterdayRate+upOrDown
      var ans = indexInfo.join("\n");
      return ans;
    }
    var url="https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query="+name;
    var data = org.jsoup.Jsoup.connect(url).get();
    var stockCode=data.select("div[class=stock_tlt]").select("span").text().split(" ")[0];
    var urlNaver="https://finance.naver.com/item/main.naver?code="+stockCode;
    var dataNaver=org.jsoup.Jsoup.connect(urlNaver).get();
    var stockTodayPrice=dataNaver.select("div[class=today]").select("span[class=blind]").text().split(" ");
    if (stockTodayPrice[0]==""){throw NullPointException}
    var stockCompareYesterday=dataNaver.select("div[class=today]").select("p[class=no_exday]").text().split(" ");
    var tmp=[stockTodayPrice[0], stockCompareYesterday[1], stockCompareYesterday[2]] //현재 가격, 등락정보, 등락가격
    var upOrDown="●"
    var upOrDownEmoji="😐"
    if (tmp[1]=="하락"){upOrDown="▼";}
    else if(tmp[1]=="상승"){upOrDown="▲";}
    if (tmp[1]=="하락"){upOrDownEmoji="😂";}
    else if(tmp[1]=="상승"){upOrDownEmoji="🥳";}
    var stockInfo=[];
    stockInfo[0] = name+" 현재 주가 정보💰";
    stockInfo[1] = "현재가 : "+tmp[0]+"원"+"("+upOrDown+")";
    stockInfo[2] = "전일대비 "+stockTodayPrice[2]+"% "+tmp[1]+upOrDownEmoji;
    stockInfo[3] = "전일대비 "+tmp[2]+"원 "+tmp[1]+upOrDownEmoji;
    var ans = stockInfo.join("\n");
    return ans;
  }
  catch(e){
    return "🧐검색되지 않는 종목이거나 KOSPI/KOSDAQ에 상장되지 않은 종목입니다." 
  }
}

//코로나 확진자 수
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

//세계날씨 함수 
function getWorldWeather(pos){
  var con = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=%EC%9D%BC%EB%B3%B8+%EB%82%A0%EC%94%A8&tqi=hlu5Esp0Jxwssf3TJoGssssssx0-422532&query="+pos+"날씨").get()
  var a = con.select(".abroad_table").select("tr").toString()
  var arr = a.split("<tr>")
  countryFlag={"미국":"🇺🇸","일본":"🇯🇵","중국":"🇨🇳","러시아":"🇷🇺"}
  for(i=0;i<arr.length;i++){
    arr[i]=arr[i].replace(/<[^>]+>/g,"").replace(/\s+/g," ");
  }
  var ans= countryFlag[pos]!=undefined ? "현재 "+countryFlag[pos]+pos+"의 날씨는?\n"+"(도시/기후/기온/체감/최저/최고)\n" : "현재 "+pos+"의 날씨는?\n"+"(도시/기후/기온/체감/최저/최고)\n"
  for(i=1;i<arr.length;i++){
    ans+=arr[i].trim()+"\n"
  }
  return ans
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
  var msgArr=[]
  msgArr=msg.split(" ");
  let dict_cmd = {};
  room = room.trim()
  dict_init(dict_cmd);

  //국내주식
  if(dict_cmd[msgArr[0]]=="/주가" && msgArr.length>1){
    var name= msgArr[1].trim()
    replier.reply(getStockInfo(name))
  }

  //모두멘션
  else if(dict_cmd[msgArr[0]]=="/모두에게" && room === "공군의장대"){
    var mention = "@고한솔 @박찬웅 @김호찬 @윤강현 @김재운 @Seil"
    replier.reply(mention)
  }
  else if(msgArr[0].trim()=="/compile"){
    replier.reply(recompile_bot_func());
    return;
  }

  else if(msg=="/우니도리"&&isGroupChat==false){
    replier.reply("🐻🐱 오늘은 "+getDday()+"일 째 사랑하고 있는 날입니다.💙");
  }

  //코로나
  else if(dict_cmd[msg]=="/코로나"){
    var res = getCorona();
    replier.reply(res);
    return
  }
  //날씨
  else if (msgArr[0] == "/날씨"){
    country=['가나', '가봉', '가이아나', '감비아', '과테말라', '그레나다', '그리스', '기니', '기니비사우', '나고르노카라바흐 공화국', '나미비아', '나우루', '나이지리아', '남수단', '남아프리카 공화국', '남오세티야', '네덜란드', '네팔', '노르웨이', '뉴질랜드', '니제르', '니카라과', '대한민국', '덴마크', '도미니카', '도미니카 공화국', '독일', '동티모르', '라오스', '라이베리아', '라트비아', '러시아', '레바논', '레소토', '루마니아', '룩셈부르크', '르완다', '리비아', '리투아니아', '리히텐슈타인', '마다가스카르', '마셜 제도', '마케도니아 공화국', '말라위', '말레이시아', '말리', '멕시코', '모나코', '모로코', '모리셔스', '모리타니', '모잠비크', '몬테네그로', '몰도바', '몰디브', '몰타', '몽골', '미국', '미얀마', '미크로네시아 연방', '바누아투', '바레인', '바베이도스', '바티칸 시국', '바하마', '방글라데시', '베냉', '베네수엘라', '베트남', '벨기에', '벨라루스', '벨리즈', '보스니아 헤르체고비나', '보츠와나', '볼리비아', '부룬디', '부르키나파소', '부탄', '북키프로스', '불가리아', '브라질', '브루나이', '사모아', '사우디아라비아', '사하라 아랍 민주 공화국', '산마리노', '상투메 프린시페', '세네갈', '세르비아', '세이셸', '세인트루시아', '세인트빈센트 그레나딘', '세인트키츠 네비스', '소말리아', '소말릴란드', '솔로몬 제도', '수단', '수리남', '스리랑카', '스와질란드', '스웨덴', '스위스', '스페인', '슬로바키아', '슬로베니아', '시리아', '시에라리온', '싱가포르', '아랍에미리트', '아르메니아', '아르헨티나', '아이슬란드', '아이티', '아일랜드', '아제르바이잔', '아프가니스탄', '안도라', '알바니아', '알제리', '압하스', '앙골라', '앤티가 바부다', '에리트레아', '에스토니아', '에콰도르', '에티오피아', '엘살바도르', '영국', '예멘', '오만', '오스트레일리아', '오스트리아', '온두라스', '요르단', '우간다', '우루과이', '우즈베키스탄', '우크라이나', '이라크', '이란', '이스라엘', '이집트', '이탈리아', '인도', '인도네시아', '일본', '자메이카', '잠비아', '적도 기니', '조선민주주의인민공화국', '조지아', '중앙아프리카 공화국', '중화민국', '중화인민공화국', '지부티', '짐바브웨', '차드', '체코', '칠레', '카메룬', '카보베르데', '카자흐스탄', '카타르', '캄보디아', '캐나다', '케냐', '코모로', '코소보 공화국', '코스타리카', '코트디부아르', '콜롬비아', '콩고 공화국', '콩고 민주 공화국', '쿠바', '쿠웨이트', '크로아티아', '키르기스스탄', '키리바시', '키프로스', '타지키스탄', '탄자니아', '태국', '터키', '토고', '통가', '투르크메니스탄', '투발루', '튀니지', '트란스니스트리아', '트리니다드 토바고', '파나마', '파라과이', '파키스탄', '파푸아뉴기니', '팔라우', '팔레스타인', '페루', '포르투갈', '폴란드', '프랑스', '피지', '핀란드', '필리핀', '헝가리'];

    //오사카 이스터에그
    if (msgArr.length > 1 && msgArr[1].trim()=="오사카"){
      replier.reply("나츠키님한테 직접 물어보세요. 간현상");
      return;
    }
    //세계 날씨
    else if (msgArr[0]=="/날씨" && country.indexOf(msgArr[1])!=-1){
      replier.reply(getWorldWeather(msgArr[1]));
      return;
    }

    //내일 날씨
    else if (msgArr.length > 1 && msgArr[1].indexOf("내일")==0){
      var pos = msgArr[1].length > 2 ? msgArr[1] : "내일서울";
      var result=getTomorrowWeatherInfo(pos.trim());
      if (result==null){
        replier.reply(pos + "의 날씨 정보를 가져올 수 없습니다. 올바른 형식을 확인해주세요.");
        return;
      }
      replier.reply(result);
      return;
    }

    //오늘 날씨
    var pos = msgArr.length > 1 ? msgArr[1] : "서울";
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
    replier.reply("찬웅게이야 빨리 탈출 안하고 뭐하노?");
    return;
  }

  //개추
  else if(dict_cmd[msg]=="/개추"){
    replier.reply("뉴스 눈나 좋으면 개 추 한번 눌러볼까?");
    return;
  }
  else if(msgArr[0]=="/너희는"){
    replier.reply("전혀 스윙하고 있지 않아\nhttps://www.youtube.com/watch?v=AgMptWkzRD4");
  }
  //아직 없는 명령어
  else if (msg[0]==="/"){
    replier.reply("아직 없는 명령어입니다. 업데이트를 기다려주세요");
    return;
  }
  
}