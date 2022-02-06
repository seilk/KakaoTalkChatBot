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