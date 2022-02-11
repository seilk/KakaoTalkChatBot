//오늘날씨 함수
function getWeatherInfo(pos) {
  try{
    var urlBase="https://m.search.naver.com/search.naver?query="+pos+"날씨"
    var htmlBase = org.jsoup.Jsoup.connect(urlBase).get()
                  
    var weatherInfo1=htmlBase.select("div[class=weather_graphic]");
    var weatherInfo2=htmlBase.select("div[class=temperature_info]");


    //현재 기후, 온도
    var curClimate=weatherInfo1.select("i[class=wt_icon ico_wt1]").select("span").text()
    var curTempArr=weatherInfo1.select("div[class=temperature_text]")
                  .select("strong").text().split(" ")
    var curTemp=curTempArr[1].slice(2,curTempArr[1].length)
    //어제대비 기온변화, 강수량
    var tempChange=weatherInfo2.select("span[class=temperature up]").text()
    var rainPercentArr=weatherInfo2.select("dl[class=summary_list]")
                        .select("dd[class=desc]").text().split(" ")
    
    var weatherEmoji = ""
    if (curClimate.indexOf("맑음")!=-1){
      weatherEmoji="☀️"
    }
    else if (curClimate.indexOf("구름많음")!=-1 ||curClimate.indexOf("흐림")!=-1){
      weatherEmoji="☁️"
    }
    else if(curClimate.indexOf("비")!=-1){
      weatherEmoji="🌧"
    }
    else if(curClimate.indexOf("눈")!=-1){
      weatherEmoji="❄️"
    }

    var res=[]
    res[0]="현재 "+pos+"날씨 : "+weatherEmoji+curClimate+"\n"
    res[1]= "🌡현재 온도 : "+curTemp
    res[2]="(어제보다 "+tempChange+")"+"\n"
    res[3]="☂️강수확률 : "+rainPercentArr[0]
    res[4]="\n⎯⎯⎯⎯⎯\n"
    res[5]=getDustInfo(pos)
    var ans = res.join("\n")
    return ans

  }catch(e){
    return pos+"의 날씨정보를 가져올 수 없습니다.";
  }
}

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
  msgArr=msg.split(" ");
  if (msgArr[0]=="/날씨"){
    replier.reply(getWeatherInfo(msgArr[1]));
  }
  if (msgArr[0]=="/미세"){
    replier.reply(getDustInfo(msgArr[1]));
  }
}