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
//국내주식
  if(dict_cmd[msgArr[0]]=="/주가" && msgArr.length>1){
    var name= msgArr[1].trim()
    replier.reply(getStockInfo(name))//
  }