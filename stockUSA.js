//미국주식 가격
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
    return("🧐검색되지 않는 종목이거나 미국 NASDAQ/DOW에 상장되지 않은 종목입니다. "+
          "\n한글로 검색하신 경우 종목티커로 다시 이용해보세요. ")
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

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  msg = msg.trim();
  var msgArr=[]
  msgArr=msg.split(" ");

  //미국주식
  if(msgArr[0]=="/미장" && msgArr.length>1){
    var name= msgArr[1].trim()
    replier.reply(stockUSA(name))
    return
  }
}