var cheerio = require('cheerio');
var request = require('request');
var url = 'https://m.search.naver.com/search.naver?sm=mtp_hty.top&where=m&query=%EC%84%9C%EC%9A%B8%EB%82%A0%EC%94%A8';
request(url, function(error, response, html){
    if (error) {throw error};
    var $ = cheerio.load(html);
    $("div.temperature_text").children("strong").each(function(){
      var weather_info = $(this);
      var weather_info_text = weather_info.text();
      console.log(weather_info_text);
    })
    

});
var url2 = org.jsoup.Jsoup.connect("m.naver.com")
console.log(url2);