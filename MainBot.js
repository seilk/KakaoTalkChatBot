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
  dict_cmd["/날씨"]
  =dict_cmd["/ㄴㅆ"]
  ="/날씨";
  //
  dict_cmd["/내일날씨"]
  =dict_cmd["/내일"]
  =dict_cmd["/ㄴㅇ"]
  =dict_cmd["/ㄴㅇㄴㅆ"]
  ="/내일날씨"
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
  =dict_cmd["/국장"]
  =dict_cmd["/ㄱㅈ"]
  ="/국장"
  //
  dict_cmd["/모두에게"]
  =dict_cmd["/모두"]
  =dict_cmd["/everyone"]
  =dict_cmd["/ㅁㄷ"]
  ="/모두에게"

  //미장
  dict_cmd["/미국"]
  =dict_cmd["/미장"]
  =dict_cmd["/ㅁㅈ"]
  =dict_cmd["/ㅁㄱ"]
  =dict_cmd["/미주"]
  =dict_cmd["/미증"]
  ="/미장"

  //나스닥
  dict_cmd["/나스닥"]
  =dict_cmd["/ㄴㅅㄷ"]
  ="/나스닥"

  //코스피
  dict_cmd["/코스피"]
  =dict_cmd["/ㅋㅅㅍ"]
  ="/코스피"

  //코스닥
  dict_cmd["/코스닥"]
  =dict_cmd["/ㅋㅅㄷ"]
  ="/코스닥"
  
  //미세먼지
  dict_cmd["/미세"]
  =dict_cmd["/ㅁㅅ"]
  =dict_cmd["/미세먼지"]
  ="/미세"

  
}

//d-day
function getDday(){
  var startDay = new Date("May 28, 2020 18:00:00").getTime();
  var today = new Date().getTime();
  var dday=Math.floor((today-startDay)/(1000*60*60*24));
  return dday+1;
}

//미국주식
function stockUSA(name){
  try{
    var url_base = "https://finance.yahoo.com/quote/";
    var ticker = (/[a-zA-Z]/.test(name))==false?null:name;
    if (ticker==null){
      var tickerkorToEng = org.jsoup.Jsoup
                          .connect("https://www.google.com/search?q="+name+"주가")
                          .get()
                          .select("span[class=WuDkNe]")
                          .text()
      ticker=tickerkorToEng
    }
    var marketCap = org.jsoup.Jsoup
                    .connect("https://www.google.com/search?q="+ticker+"시총")
                    .get()
                    .select("tr[data-attrid=시가총액]")
                    .select("td[class=iyjjgb]")
                    .toString().replace(/<[^>]+>/g,"").replace(/\s+/g," ")
    
    var urlYahoo=url_base+ticker;
    var stockTitleUSA=org.jsoup.Jsoup
                      .connect(urlYahoo)
                      .get()
                      .select("div[class=Mt(15px)]")
                      .select("h1[class=D(ib) Fz(18px)]")
                      .text()
    var mainPrice=org.jsoup.Jsoup //정규장 [0]현재가격 [1]변화한 가격 [2]변화율%
                    .connect(urlYahoo)
                    .get()
                    .select("div[class=D(ib) Mend(20px)]")
                    .toString().trim()
                    .replace(/<[^>]+>/g,"").trim().replace(/\s+/g," ")
                    .split(" ")
    for(i=0;i<mainPrice.length;i++){mainPrice[i]=mainPrice[i].trim()}
    mainPrice=mainPrice.join("/").split("/")

    var otherTimePrice=org.jsoup.Jsoup //애프터장 or 프리장 [0]현재가격 [1]변화한 가격 [2]변화율%
                            .connect(urlYahoo)
                            .get()
                            .select("div[class=Fz(12px) C($tertiaryColor) My(0px) D(ib) Va(b)]")
                            .toString().trim()
                            .replace(/<[^>]+>/g,"").replace(/\s+/g," ")
                            .split(" ")
    for(i=0;i<otherTimePrice.length;i++){otherTimePrice[i]=otherTimePrice[i].trim()}
    otherTimePrice=otherTimePrice.join("/").split("/")

    emojiMainPrice="😐";
    upOrDownMain="●";
    if (mainPrice[1][0]==="+"){
      emojiMainPrice="🥳";
      upOrDownMain="▲";
    }
    else if (mainPrice[1][0]==="-"){
      emojiMainPrice="😱";
      upOrDownMain="▼";
    }

    emojiOtherPrice="😐";
    upOrDownOthers="●";
    if (otherTimePrice[2][0]==="+"){
      emojiOtherPrice="🥳"; 
      upOrDownOthers="▲";
    }
    else if (otherTimePrice[2][0]==="-"){
      emojiOtherPrice="😱"; 
      upOrDownOthers="▼";
    }
    if (mainPrice[0]==""||mainPrice[0]==null||mainPrice[0]==undefined){throw NullPointException}
    
    var res=[]
    res[0]="🇺🇸미장 - YahooFinance\n\n"+stockTitleUSA+"\n"+"시가총액 : "+marketCap+"달러\n"
    res[1]="[정규장]\n"
            +"$"+mainPrice[0]+"("+upOrDownMain+")"
            +"\n전일대비 : "+mainPrice[1]+mainPrice[2]+emojiMainPrice+"\n"
    res[2]="[정규장 외] "+otherTimePrice[4]+"\n" 
            +"$"+otherTimePrice[1]+"("+upOrDownOthers+")"
            +"\n전일대비 : "+otherTimePrice[2]+otherTimePrice[3]+emojiOtherPrice
    
    var ans= res.join("\n")+"\n\n"+getUSAIndex()
    return ans
  }
  catch(e){
    return("🧐검색되지 않는 종목이거나 미국 NASDAQ/DOW에 상장되지 않은 종목입니다.\n"+
          "한글로 검색하신 경우 종목티커로 다시 이용해보세요.")
  }
}

//미국 나스닥
function getUSAIndex(){
  var urlBase="https://www.google.com/search?q=나스닥지수";
  var data=org.jsoup.Jsoup.connect(urlBase).get();
  var nasdaqIndex=data.select("span[jsname=vWLAgc]")
                  .toString().replace(/<[^>]+>/g,"").trim();
  var nasdaqChange=data.select("span[jsname=qRSVye]")
                  .toString().replace(/<[^>]+>/g,"").trim();
  var nasdaqChangePercent=data.select("span[jsname=rfaVEf]")
                          .toString().replace(/<[^>]+>/g,"").trim();
  var nasdaqArr=(nasdaqIndex+"\n"+nasdaqChange+"\n"+nasdaqChangePercent).split("\n")
  
  var res=[]
  res[0] = "현재 나스닥 : "+nasdaqArr[0]
  res[1] = "전일대비 : "+nasdaqArr[1]+nasdaqArr[2]
  return res.join("\n")
}

//국내코스피, 코스닥
function getKorIndex(name){
  let isIndex = {};
  isIndex["코스피"]=isIndex["ㅋㅅㅍ"]=isIndex["유가증권"]="코스피"
  isIndex["코스닥"]=isIndex["ㅋㅅㄷ"]="코스닥"
  var url="https://www.google.com/search?q=%EC%A3%BC%EA%B0%80"+isIndex[name];
  var data = org.jsoup.Jsoup.connect(url).get();
  var indexNum = data.select("span[class=IsqQVc NprOob wT3VGc]").toString().trim().replace(/<[^>]+>/g,"");
  var indexCompareYesterday = data.select("span[jsname=qRSVye]").toString().trim().replace(/<[^>]+>/g,"").split("\n")[0];
  var indexCompareYesterdayRate = data.select("span[jsname=rfaVEf]").toString().trim().replace(/<[^>]+>/g,"").split("\n")[0];
  var upOrDown= (indexCompareYesterday[0].indexOf("−")!=-1)?"▼":"▲";
  var indexInfo=[];

  indexInfo[0] = "현재 "+name
  indexInfo[1] = isIndex[name]+ " : " +indexNum
  indexInfo[2] = "전일대비 : "+indexCompareYesterday+indexCompareYesterdayRate+upOrDown;
  var ans = indexInfo.join("\n");
  return ans;
}
//국내주식가격
function getStockInfo(name){
  try{
    var url="https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query="+name;
    var data = org.jsoup.Jsoup.connect(url).get();
    var stockTitle = data.select("div[class=stock_tlt]").select("strong").text()
    var isKospiOrKosdaq = data.select("div[class=stock_tlt]").select("span")
                          .toString().replace(/<[^>]+>/g,"").trim().split(" ")[1]
    var stockCode=data.select("div[class=stock_tlt]").select("span").text().split(" ")[0];
    var marketCap=data.select("div[class=detail]").select("li")
                  .toString().replace(/<[^>]+>/g,"").trim()
                  .split("시가총액")[1].split("외국인소진율")[0].replace(/\s+/g,"")
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
    if (tmp[1]=="하락"){upOrDownEmoji="😱";}
    else if(tmp[1]=="상승"){upOrDownEmoji="🥳";}
    var stockInfo=[];
    stockInfo[0] = "🇰🇷국장 - NaverStock\n"
    stockInfo[1] = stockTitle;
    stockInfo[2] = "시가총액 : "+marketCap+"원\n"
    stockInfo[3] = "현재가 : "+tmp[0]+"원"+"("+upOrDown+")";
    stockInfo[4] = "전일대비 "+stockTodayPrice[2]+"% "+tmp[1]+upOrDownEmoji;
    stockInfo[5] = "전일대비 "+tmp[2]+"원 "+tmp[1]+upOrDownEmoji+"\n";
    stockInfo[6] = (isKospiOrKosdaq=="KOSPI")?getKorIndex("코스피"):getKorIndex("코스닥") 
    var ans = stockInfo.join("\n")
    return ans;
  }
  catch(e){
    return "🧐검색되지 않는 종목이거나 KOSPI/KOSDAQ에 상장되지 않은 종목입니다.\n"+
            "미국주식 검색은 \"/ㅁㅈ\", \"/ㅁㄱ\", \"/미장\"을 이용하세요." 
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
function getTomorrowWeatherInfo(pos){
  try{
    var data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query="+pos+"%20내일날씨")
              .get()
    var weather_info_list=data.select("ul[class=weather_info_list]")

    var temperature_info=weather_info_list.select("div[class=weather_graphic]")
                                          .select("div[class=temperature_text]")
                                          .toString()
                                          .replace(/<[^>]+>/g,"")
                                          .replace(/[^0-9-\n]+/g,"")
                                          .replace(/\n+(?=\n)/g,"")
                                          .split("\n");

    var climate_info=weather_info_list.select("div[class=temperature_info]")
                                          .select("p")
                                          .toString()
                                          .trim()
                                          .replace(/<[^>]+>/g,"")
                                          .split("\n"); //기후

    var rainy_info=weather_info_list.select("div[class=temperature_info]").select("dl").toString().trim()
                                    .replace(/<[^>]+>/g,"") //태그제거
                                    .replace(/[^\S\n]+/g,"") //줄바꿈을 제외한 모든 공백 제거
                                    .replace(/\n+(?=\n)/g, '') //줄바꿈이 연속으로 나오는 경우 하나로 축약
                                    .split("\n");

    var report_card_wrap=weather_info_list.select("div[class=report_card_wrap]").toString().trim()
                                          .replace(/<[^>]+>/g,"") //태그제거
                                          .replace(/[^\S\n]+/g,"") //줄바꿈을 제외한 모든 공백 제거
                                          .replace(/\n+(?=\n)/g, '') //줄바꿈이 연속으로 나오는 경우 하나로 축약
                                          .split("\n");
    
    var climate_AM_PM=[climate_info[0], climate_info[1]]
    var rainy_AM_PM=[rainy_info[2], rainy_info[4]]
    var dust_and_fineDust_AM=[report_card_wrap[1].slice(4), report_card_wrap[2].slice(5)]
    var dust_and_fineDust_PM=[report_card_wrap[3].slice(4), report_card_wrap[4].slice(5)]

    var emoji_AM=""
    if (climate_AM_PM[0].indexOf("맑음")!=-1){
      emoji_AM="☀️";
    }
    else if(climate_AM_PM[0].indexOf("구름많음")!=-1||climate_AM_PM[0].indexOf("흐림")!=-1){
      emoji_AM="☁️";
    }
    else if(climate_AM_PM[0].indexOf("비")){
      emoji_AM="🌧";
    }
    else if(climate_AM_PM[0].indexOf("눈")){
      emoji_AM="❄️";
    }

    var emoji_PM=""
    if (climate_AM_PM[1].indexOf("맑음")!=-1){
      emoji_PM="☀️";
    }
    else if(climate_AM_PM[1].indexOf("구름많음")!=-1||climate_AM_PM[1].indexOf("흐림")!=-1){
      emoji_PM="☁️";
    }
    else if(climate_AM_PM[1].indexOf("비")){
      emoji_PM="🌧";
    }
    else if(climate_AM_PM[1].indexOf("눈")){
      emoji_PM="❄️";
    }

    var res=[]
    res[0]="내일 "+"<"+pos+"> "+"날씨\n"
    res[1]="⎯ 오전 : "+climate_AM_PM[0]+emoji_AM+" ⎯"
    res[2]="🌡예상 온도(AM) : "+temperature_info[0]+"℃";
    res[3]="☂️강수확률(AM) : "+rainy_AM_PM[0]
    res[4]="😷미세먼지: "+dust_and_fineDust_AM[0]+"\n"+"🤢초미세먼지 : "+dust_and_fineDust_AM[1]+"\n"

    res[5]="⎯ 오후 : "+climate_AM_PM[1]+emoji_PM+" ⎯"
    res[6]= "🌡예상 온도(PM) : "+temperature_info[1]+"℃";
    res[7]="☂️강수확률(PM) : "+rainy_AM_PM[1]
    res[8]="😷미세먼지 : "+dust_and_fineDust_PM[0]+"\n"+"🤢초미세먼지 : "+dust_and_fineDust_PM[1]
    
    var ans=res.join("\n");
    return ans
  }
  catch(e){
    return "내일 " + pos+ "의 날씨를 가져올 수 없습니다. 다른 지역명으로 검색해보세요.";
  }
}

//오늘날씨 함수
function getWeatherInfo(pos) {
  try{
    var urlBase="https://m.search.naver.com/search.naver?query="+pos+"날씨"
    var htmlBase = org.jsoup.Jsoup.connect(urlBase).get()
                  
    var weatherInfo1=htmlBase.select("div[class=weather_graphic]");
    var weatherInfo2=htmlBase.select("div[class=temperature_info]");


    //현재 기후, 온도
    var curClimate=weatherInfo1
                  .select("div[class=weather_main]")
                  .select("span")
                  .text()
                  .split(" ")[0];
    var curTempArr=weatherInfo1
                  .select("div[class=temperature_text]")
                  .select("strong")
                  .text()
                  .split(" ");
    var curTemp=curTempArr[1].slice(2,curTempArr[1].length);

    //어제대비 기온변화
    var tempChangeArr=weatherInfo2
                    .select("div[class=temperature_info]")
                    .select("p")
                    .text()
                    .split(" ");
    var tempChange=[tempChangeArr[1], tempChangeArr[2]]
    //강수량
    var rainPercentArr=weatherInfo2.select("dl[class=summary_list]")
                        .select("dd[class=desc]").text().split(" ");
    
    var weatherEmoji = "";
    if (curClimate.indexOf("맑음")!=-1){
      weatherEmoji="☀️";
    }
    else if (curClimate.indexOf("구름많음")!=-1 ||curClimate.indexOf("흐림")!=-1){
      weatherEmoji="☁️";
    }
    else if(curClimate.indexOf("비")!=-1){
      weatherEmoji="🌧";
    }
    else if(curClimate.indexOf("눈")!=-1){
      weatherEmoji="❄️";
    }

    var res=[]
    res[0]="현재 "+"<"+pos+">"+" 날씨 : "+weatherEmoji+curClimate+"\n"
    res[1]= "🌡현재 온도 : "+curTemp
    res[2]="(어제보다 "+tempChange[0]+" "+tempChange[1]+")"+"\n"
    res[3]="☂️강수확률 : "+rainPercentArr[0]
    res[4]="\n⎯⎯⎯⎯⎯\n"
    res[5]=getDustInfo(pos)
    var ans = res.join("\n")
    return ans

  }catch(e){
    return pos+"의 날씨정보를 가져올 수 없습니다. 다른 지역명으로 검색해보세요.";
  }
}

//미세먼지
function getDustInfo(pos){
  try{
    var urlBase="https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=&tqi=hlUlIsp0JWCsskWVdS0ssssstxh-086230&query="+pos+"+미세먼지";
    var htmlBase=org.jsoup.Jsoup.connect(urlBase).get();
    
    var updateInfo=htmlBase.select("div[class=update_info]")
    var updateInfoTime=updateInfo.select("span[class=time]").text().split(" ")

    var dustInfos=htmlBase.select("li[class=_who _info_layer]")
                  .select("ul[class=inner_box]");
    var normalDustInfo=dustInfos.select("li[class=level6 _fine_dust _level]");
    var ultraFineDustInfo=dustInfos.select("li[class=level6 _ultrafine_dust _level]");

    var normalDust1=normalDustInfo.select("div[class=figure_box _value]").text();
    var normalDust2=normalDustInfo.select("strong[class=figure_text _text]").text();

    var ultraFineDust1=ultraFineDustInfo.select("div[class=figure_box _value]").text();
    var ultraFineDust2=ultraFineDustInfo.select("strong[class=figure_text]").text();

    var normalDustInfo=[normalDust1,normalDust2];
    var ultraFineDustInfo=[ultraFineDust1,ultraFineDust2];
    
    if (normalDustInfo[0]==""||updateInfoTime[0]+updateInfoTime[1]==undefined||ultraFineDustInfo[1]==""){
      throw NullPointException;
    }
    var res=[];
    res[0]=pos+" 미세/초미세먼지 정보";
    res[1]="("+updateInfoTime[0]+updateInfoTime[1]+" 업데이트)\n";
    res[2]="😷미세먼지 : "+normalDustInfo[0];
    res[3]="WHO 기준 ["+normalDustInfo[1]+"]\n"
    res[4]="🤢초미세먼지 : "+ultraFineDustInfo[0];
    res[5]="WHO 기준 ["+ultraFineDustInfo[1]+"]"

    var ans = res.join("\n")
    return ans
  }
  catch(e){
    return "미세먼지는 동이름, 동네이름으로 검색해주세요.\nex)/미세 신수동"
  }
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  msg = msg.trim();
  if (msg.indexOf("/")!=0){
    return;
  }

  var msgArr=msg.split(" ");
  let dict_cmd = {};
  dict_init(dict_cmd);
  room = room.trim()

   //명령어세트 확인
  if (msgArr[0].indexOf("/명령어")!=-1){
    var ans="날씨 : /날씨 (지역명)\n"+
            "내일날씨 : /내일날씨 (지역명)\n"+
            "미세먼지 : /미세 (동네이름)\n"+
            "주식(국장) : /주가 (종목이름(국장))\n"+
            "코스피 : /코스피\n"+
            "코스닥 : /코스닥\n"+
            "주식(미장) : /미장 (종목이름(미장))\n"+
            "코로나19 확진자 수, 백신 접종 현황 : /코로나\n\n"+
            "초성으로도 가능합니다.\n(ex. 날씨➡️ㄴㅆ, 주식➡️ㅈㅅ)"
    replier.reply(ans);
    return;
  }

  //국내주식
  else if(msgArr.length>1 && dict_cmd[msgArr[0]].indexOf("/국장")!=-1){
    var name= msgArr[1].trim()
    replier.reply(getStockInfo(name))
    return;
  }

  //코스피
  else if(dict_cmd[msgArr[0]].indexOf("/코스피")!=-1){
    replier.reply(getKorIndex("코스피"))
    return;
  }

  //코스닥
  else if(dict_cmd[msgArr[0]].indexOf("/코스닥")!=-1){
    replier.reply(getKorIndex("코스닥"))
    return;
  }

  //미국주식
  else if(dict_cmd[msgArr[0]].indexOf("/미장")!=-1 && msgArr.length>1){
    var name= msgArr[1].trim()
    replier.reply(stockUSA(name))
    return;
  }

  //나스닥
  else if(dict_cmd[msgArr[0]].indexOf("/나스닥")!=-1){
    replier.reply(getUSAIndex())
    return;
  }

  //모두멘션
  else if(dict_cmd[msgArr[0]]=="/모두에게" && room === "공군의장대"){
    var mention = "@고한솔 @박찬웅 @김호찬 @윤강현 @김재운 @강세일"
    replier.reply(mention)
    return
  }

  //컴파일
  else if(msgArr[0].trim()=="/compile"){
    replier.reply(recompile_bot_func());
    return;
  }

  else if(msg=="/우니도리" && isGroupChat==false){
    replier.reply("🐻🐱 오늘은 "+getDday()+"일 째 사랑하고 있는 날입니다.💙");
    return;
  }

  //코로나
  else if(dict_cmd[msgArr[0]].indexOf("/코로나")!=-1){
    var res = getCorona();
    replier.reply(res);
    return;
  }

  //미세먼지
  else if (dict_cmd[msgArr[0]].indexOf("/미세")!=-1){
    if (msgArr.length>1){replier.reply(getDustInfo(msgArr[1]));}
    else {replier.reply(getDustInfo("중구"));}
    return;
  }

  //내일 날씨
  else if (dict_cmd[msgArr[0]].indexOf("/내일날씨")!=-1){
    var pos = msgArr.length > 1 ? msgArr[1] : "서울";
    var result=getTomorrowWeatherInfo(pos);
    replier.reply(result);
    return;
  }

  //날씨
  else if (dict_cmd[msgArr[0]].indexOf("/날씨")!=-1){
    country=['가나', '가봉', '가이아나', '감비아', '과테말라', 
    '그레나다', '그리스', '기니', '기니비사우', '나고르노카라바흐 공화국', 
    '나미비아', '나우루', '나이지리아', '남수단', '남아프리카 공화국', 
    '남오세티야', '네덜란드', '네팔', '노르웨이', '뉴질랜드', '니제르', 
    '니카라과', '대한민국', '덴마크', '도미니카', '도미니카 공화국', '독일', 
    '동티모르', '라오스', '라이베리아', '라트비아', '러시아', '레바논', '레소토', 
    '루마니아', '룩셈부르크', '르완다', '리비아', '리투아니아', '리히텐슈타인', '마다가스카르', 
    '마셜 제도', '마케도니아 공화국', '말라위', '말레이시아', '말리', '멕시코', '모나코', 
    '모로코', '모리셔스', '모리타니', '모잠비크', '몬테네그로', '몰도바', '몰디브', '몰타', 
    '몽골', '미국', '미얀마', '미크로네시아 연방', '바누아투', '바레인', '바베이도스', '바티칸 시국', 
    '바하마', '방글라데시', '베냉', '베네수엘라', '베트남', '벨기에', '벨라루스', '벨리즈', 
    '보스니아 헤르체고비나', '보츠와나', '볼리비아', '부룬디', '부르키나파소', '부탄', '북키프로스', 
    '불가리아', '브라질', '브루나이', '사모아', '사우디아라비아', '사하라 아랍 민주 공화국', '산마리노', 
    '상투메 프린시페', '세네갈', '세르비아', '세이셸', '세인트루시아', '세인트빈센트 그레나딘', 
    '세인트키츠 네비스', '소말리아', '소말릴란드', '솔로몬 제도', '수단', '수리남', '스리랑카', 
    '스와질란드', '스웨덴', '스위스', '스페인', '슬로바키아', '슬로베니아', '시리아', '시에라리온', 
    '싱가포르', '아랍에미리트', '아르메니아', '아르헨티나', '아이슬란드', '아이티', '아일랜드', 
    '아제르바이잔', '아프가니스탄', '안도라', '알바니아', '알제리', '압하스', '앙골라', '앤티가 바부다', 
    '에리트레아', '에스토니아', '에콰도르', '에티오피아', '엘살바도르', '영국', '예멘', '오만', '오스트레일리아', 
    '오스트리아', '온두라스', '요르단', '우간다', '우루과이', '우즈베키스탄', '우크라이나', '이라크', '이란', '이스라엘', 
    '이집트', '이탈리아', '인도', '인도네시아', '일본', '자메이카', '잠비아', '적도 기니', '조선민주주의인민공화국', '조지아', 
    '중앙아프리카 공화국', '중화민국', '중화인민공화국', '지부티', '짐바브웨', '차드', '체코', '칠레', '카메룬', '카보베르데', 
    '카자흐스탄', '카타르', '캄보디아', '캐나다', '케냐', '코모로', '코소보 공화국', '코스타리카', '코트디부아르', '콜롬비아', 
    '콩고 공화국', '콩고 민주 공화국', '쿠바', '쿠웨이트', '크로아티아', '키르기스스탄', '키리바시', '키프로스', '타지키스탄', 
    '탄자니아', '태국', '터키', '토고', '통가', '투르크메니스탄', '투발루', '튀니지', '트란스니스트리아', '트리니다드 토바고', 
    '파나마', '파라과이', '파키스탄', '파푸아뉴기니', '팔라우', '팔레스타인', '페루', '포르투갈', '폴란드', '프랑스', '피지', 
    '핀란드', '필리핀', '헝가리'];

    //오사카 이스터에그
    if (msgArr.length > 1 && msgArr[1].trim()=="오사카"){
      replier.reply("모치론~★☆");
      return;
    }
    //세계 날씨
    else if (country.indexOf(msgArr[1])!=-1){
      replier.reply(getWorldWeather(msgArr[1]));
      return;
    }
    //오늘 날씨
    var pos = msgArr.length > 1 ? msgArr[1] : "서울";
    var result = getWeatherInfo(pos.trim());
    replier.reply(result);
    return;
  }
  else{
    replier.reply("잘못된 명령어입니다.😅 명령어 확인은 \"/명령어\"를 입력하세요.");
  }
}