//app.js
const UrlUtil = require('libraries/serverUrlUtil.js')
const properties = require('libraries/properties.js')
App({
  getUserInfo: function (cb) {
    wx.clearStorageSync();
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          that.globalData.code = res.code;
          wx.getUserInfo({
            success: function (res) {
              res.userInfo.gender = res.userInfo.gender.toString();
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userType:'',
    userInfo: null,
    // userInfo:{},
    code: "",
    userId: "",
    familyId: "",
    groupMemberId: ""
    // groupMemberId: "01226588748845373020170629172813"
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    wx.clearStorageSync();
    this.getUserInfo();
  }
})