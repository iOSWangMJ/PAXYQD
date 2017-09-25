//serverUrlUtil.js  用于和后端服务器交互的公用处理模块

 const API_URL = 'https://www.qingfanyun.cn/WechatRest'  //用于不带URL的公用函数
//const API_URL = 'http://localhost:8080/WechatRest'  //用于不带URL的公用函数	
const Promise = require('./bluebird')

//不带URL（不通过传参）调用服务器公用函数
function fetchApi (type, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      method:'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: resolve,
      fail: reject
    })
  })
}
//带URL（通过传参）调用服务器公用函数获取json结果集
function fetchApiJson (URL,type, params) {
    console.log(Object.assign({}, params))
  return new Promise((resolve, reject) => {
	wx.request( {  
		  url: `${URL}/${type}`,  
      data: Object.assign({}, params),  
		  header: {  "Content-Type": "application/json"  },  
		  method: "POST",    
		  success: resolve,
      fail: reject 
		})  
	  })
}	
//带URL（通过传参）调用服务器公用函数
function fetchApiUrl (URL,type, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${URL}/${type}`,
      method:'post',
      data: Object.assign({}, params),
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: resolve,
      fail: reject
    })
  })
}

//-----------------对外输出-------------------------------//
module.exports = {
  //查多条记录
  find (type, page = 1, count = 20, search = '') {
    const params = { currentPage: page, pageSize: count }
    return fetchApi(type, search ? Object.assign(params, search) : params)
      .then(res => res.data)
  },
  //查一条记录
  findOne (id) {
    return fetchApi('subject/' + id)
      .then(res => res.data)
  },
   //多条记录分页处理
  findList (URL,type,parm,pages){
    pages = { currentPage: parm.page1  * parm.count, pageSize: parm.size1}
    return fetchApiUrl(URL,type, pages)
      .then(res => res.data)
  },
  //json记录处理
  findJson (URL,type,params) {
    return fetchApiJson(URL,type , params)
      .then(res => res.data)
  },
  //单条记录处理
  findSingle (URL,type,params) {
    return fetchApiUrl(URL,type,params)
      .then(res => res.data)
  },
  //提交表单
  submit(type,params) {
    return fetchApi(type,params)
      .then(res => res.data)
  },
  returnMsg:function(d,t_url) {        
    if(d.responseCode=="0")
    {
        wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
        });
        if(t_url){
           wx.redirectTo ({url: t_url});
        }else{
          wx.navigateBack();
        }
         
    }else{
         var msg=d.responseMsg;
          wx.showToast({
            title: msg,
            icon: 'warn',
            duration: 2000
        });
    }
    },
    /**
     * 判断是否是数字或者为空
     * str: 要校验的字符串
     * field：字段含义
     */
    isNumber:function(str, field) {
        var showMsg="";
        var isContinue=true;
        if(isContinue&&str!=null&&str.length==0){
            showMsg="不可为空";
            isContinue= false;
        }
        if(isContinue)
        {
          showMsg="不是数字";
          var g = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
          isContinue=g.test(str);
        }
        if(!isContinue){
          wx.showToast({
            title: field+showMsg,
            icon: 'warn',
            duration: 2000
          })}
        return isContinue;
    },
    /**
     * 判断字符串是否为空，或者不在指定长度内
     * str: 要校验的字符串
     * field：字段含义
     * min:最小长度
     * max:最大长度
     */
    isStringSuitable:function(str, field,min,max) {
        var showMsg="";
        var isContinue=true;
        if(str==null||str==""||str=="undefined"){
            showMsg="不可为空";
            isContinue= false;
        }
        if(isContinue&&min!=""&&str.length<min)
        {
          showMsg="小于最小长度"+min;
          isContinue= false;
        }
        if(isContinue&&max!=""&&str.length>max)
        {
          showMsg="大于最大长度"+max;
          isContinue= false;
        }
        if(!isContinue){
          wx.showToast({
            title: field+showMsg,
            icon: 'warn',
            duration: 2000
          })}
        return isContinue;
    },
    //倒计时
    countTime: function (finishTime) {
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var endDate = new Date(finishTime);
      var end = endDate.getTime();
      //时间差
      var leftTime = end - now;
      //定义变量 d,h,m,s保存倒计时的时间
      var d, h, m, s;
      //大于0
      if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        if (h < 10) {
          h = "0" + h;
        }
        m = Math.floor(leftTime / 1000 / 60 % 60);
        if (m < 10) {
          m = "0" + m;
        }
        s = Math.floor(leftTime / 1000 % 60);
        if (s < 10) {
          s = "0" + s;
        }
        let time = h + ":" + m + ":" + s;
        let day = d + "天";
        return {
          day:day,
          time:time
        };
      } else {
        return null;
      }
    }
}
