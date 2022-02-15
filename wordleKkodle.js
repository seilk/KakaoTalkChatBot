//워들 꼬들
function launchWordle(){
  var res = []
  var tmp = getDate()
  var dates= [tmp[0]+"년", tmp[1]+"월", tmp[2]+"일", tmp[3]]
  res[0]="<"+dates.join(" ")+">\n"
  res[1]="🆆🅾🆁🅳🅻🅴" 
  res[2]="& 🅺🅺🅾🅳🅻🅴"
  res[3]=""
  res[4]="워들 : https://nyti.ms/33mh6mx\n"
  res[5]="꼬들 : https://bit.ly/3uOzkIH"
  var ans = res.join("\n")
  return ans
}