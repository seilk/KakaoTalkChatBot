function getWorldWeather(pos){
  con = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=%EC%9D%BC%EB%B3%B8+%EB%82%A0%EC%94%A8&tqi=hlu5Esp0Jxwssf3TJoGssssssx0-422532&query="+pos).get()
  a = con.select(".tr").text()
}