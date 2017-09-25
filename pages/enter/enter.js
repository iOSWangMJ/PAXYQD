const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp()
Page({
  data: {
    isFirst:true
  },
  onLoad: function () {
    wx.clearStorageSync();
    if (!app.globalData.userId){
      wx.clearStorageSync();
      console.log('無Userid')
      var that = this;
      app.getUserInfo(function (userInfo) {
        that.setData({
          userInfo: userInfo,
          code: app.globalData.code
        });
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
        console.log(obj)
        UrlUtil.findJson(properties.getURL(), "loginIn", { "code": that.data.code, "userInfo": obj }).then(d => {

          if (d.respCode == "0000") {
            app.globalData.familyId = d.familyId;
            app.globalData.userId = d.userId;
            app.globalData.groupMemberId = d.groupMemberId
            console.log(app.globalData.familyId)
            console.log(app.globalData.userId)
            console.log(app.globalData.groupMemberId)
            if (app.globalData.familyId && app.globalData.groupMemberId) {
              console.log("11111111111")
              wx.reLaunch({
                url: '../index/index',
              })
            } else {
              console.log("222222222")
              wx.reLaunch({
                url: "../roleSelect/roleSelect"
              })
            }
          }

        })

      })
    }
    if (app.globalData.familyId && app.globalData.userId && app.globalData.groupMemberId){
      console.log('都有');
      wx.switchTab({
        url: '../index/index',
      })
    }
    if (app.globalData.userId && !app.globalData.familyId){
      console.log('有userid無familyid')
      wx.redirectTo({
        url: "../roleSelect/roleSelect"
      })
    }
    console.log('其他');
    console.log(app.globalData);
  }
})