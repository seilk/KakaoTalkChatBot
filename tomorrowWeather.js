//내일날씨 함수
function getTomorrowWeatherInfo(pos){
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
    res[8]="😷미세먼지 : "+dust_and_fineDust_PM[0]+"\n"+"🤢초미세먼지 : "+dust_and_fineDust_PM[1]+"\n"
    
    var ans=res.join("\n");
    return ans
  
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  msg = msg.trim();
  msgArr=msg.split(" ");
  if (msgArr[0]=="/내일날씨"){
    replier.reply(getTomorrowWeatherInfo(msgArr[1]));
  }
}