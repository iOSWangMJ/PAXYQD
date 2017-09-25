//utilBase.js  基类函数集集

//日期函数
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
//字符转换函数
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//控制台日子输出函数
function sayHello(name) {
  console.log(`Hello ${name} !`)
}
function json2Form(json) {  
    var str = [];  
    for(var p in json){  
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));  
    }  
    return str.join("&");  
}  

//-----------------对外输出-------------------------------//
module.exports = {
  formatTime: formatTime,
  sayHello:sayHello,
  json2Form:json2Form, 
}

//根据UnionID获取用户信息
function getUserinfobyUnionID(unionID) {

var token=getAccessToken();

  wx.request({
  url: 'https://api.weixin.qq.com/cgi-bin/token',
  data: {
     grant_type: 'client_credential' ,
     appid: 'wx2b5d7dc2a5bf5ac5',
     secret: 'ee9284c17caa677cfc5d58ca446d2664'
  },
  method:"get",
  success: function(res) {
     var token = res.access_token;
  }
});
}

//根据UnionID获取用户信息
function getAccessToken() {
  wx.request({
  url: 'https://api.weixin.qq.com/cgi-bin/token',
  data: {
     grant_type: 'client_credential' ,
     appid: 'APPID',
     secret: 'secret'
  },
  method:"get",
  success: function(res) {
     var token = res.access_token;
     return token;
  }
});
}




