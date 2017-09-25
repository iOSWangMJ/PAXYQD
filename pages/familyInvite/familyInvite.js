const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp();
Page({
  data: {
    avatarUrl:"",
    nickName:"",
    tGroupMemberId:"",
    familyId:"",
    popShow: false,
    popShowText: ""
  },
  // 获取参数
  onLoad:function(options){
    console.log("在邀请宝宝");
    console.log(options);
    //假如是从宝宝标签选择跳转过来的则退出当前页
    if (options.isClose == "yes") {
      wx.navigateBack();
    } else {
      this.setData({
        avatarUrl: options.avatarUrl,
        nickName: options.nickName,
        tGroupMemberId: options.tGroupMemberId,
        familyId: options.familyId
      });
    }    
  },
  // 点击马上加入触发的函数
  addFamily:function(){
    let that = this;
    if(!app.globalData.userId){
      
      app.getUserInfo(function (userInfo) {
        console.log("-------------------------------------"),
          console.log(app.globalData.code),
          // 更新数据
          // that.setData({
          //   userInfo: userInfo,
          //   nickName: userInfo.nickName,
          //   code: app.globalData.code
          // });
          app.globalData.userInfo = userInfo;
        let obj = {};
        console.log(app.globalData.userInfo);
        //头像
        obj.avatarUrl = app.globalData.userInfo.avatarUrl;
        //性别
        obj.gender = app.globalData.userInfo.gender;
        //昵称
        obj.nickName = app.globalData.userInfo.nickName;
        //国家
        obj.country = app.globalData.userInfo.country;
        //省份
        obj.province = app.globalData.userInfo.province;
        //城市
        obj.city = app.globalData.userInfo.city;
        let th = that;
        UrlUtil.findJson(properties.getURL(), 'loginIn', { "code": app.globalData.code, "userInfo": obj }).then(d => {
          console.log('接口')
          console.log(d);
          if (d.respCode == "0000") {
            app.globalData.userId = d.userId;
            app.globalData.groupMemberId = d.groupMemberId;
            app.globalData.familyId = d.familyId;
            app.globalData.userType = d.userType;
           if(d.userType != "00"){
            // if (d.familyId && d.groupMemberId){
            //   app.globalData.familyId = d.familyId;
            //   app.globalData.groupMemberId = d.groupMemberId;
            //   // 弹出框提示后台信息
            //   th.setData({
            //     popShow: true,
            //     popShowText: "您已加入小友钱袋，稍后跳转到您的家庭首页"
            //   });
            //   // 三秒之后跳转
            //   setTimeout(function () {
            //     th.setData({
            //       popShow: false
            //     });
            //     // 跳转到他自己所在家庭的首页
            //     wx.reLaunch({
            //       url: '../index/index',
            //     })
            //   }, 3000);  
            // }else{
            // 跳转到标签选择页面
            wx.navigateTo({
              url: '../babySet/babySet?tGroupMemberId=' + th.data.tGroupMemberId + '&roleType=01&familyId=' + th.data.familyId,
            })
            // }
           }else{
             th.setData({
               popShow: true,
               popShowText: "您是家長無法成為寶寶"
             });
             // 三秒之后退出
             setTimeout(function () {
               wx.reLaunch({
                 url: '../index/index',
               })
               th.setData({
                 popShow: false
               });
             }, 1000);
           }
          } else {
            // 弹出框提示后台信息
            th.setData({
              popShow: true,
              popShowText: "系统繁忙,请稍后再试"
            });
            // 三秒之后退出
            setTimeout(function () {
              th.setData({
                popShow: false
              });
            }, 3000);
          }
        })
      })
    }else{
      if(app.globalData.userType!='00'){
        wx.navigateTo({
          url: '../babySet/babySet?tGroupMemberId=' + that.data.tGroupMemberId + '&roleType=01&familyId=' + that.data.familyId,
        })
      }else{
        that.setData({
          popShow: true,
          popShowText: "您是家長無法成為寶寶"
        });
        // 三秒之后退出
        setTimeout(function () {
          wx.reLaunch({
            url: '../index/index',
          })
          that.setData({
            popShow: false
          });
        }, 1000);
      }
    }
  },
  // 默默拒绝
  disagree:function(){
    console.log('wx.navigateBack');
    wx.navigateBack();
  }
});