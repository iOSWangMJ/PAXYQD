// pages/roleSelect/roleSelect.js
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app=getApp();
Page({
  bindFamilyTap:function(){
      // 无需传参，跳转到选择家长标签页面，roleType自然是00
      wx.navigateTo({
        url: '../familySet/familySet',
      })
  },
  bindBabyTap: function () {
      // 无需传参，跳转到选择家长标签页面，roleType自然是01
    wx.navigateTo({
      url: '../babySet/babySet',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // var that = this
    // app.getUserInfo(function (userInfo) {
    //   console.log("-------------------------------------"),
    //     console.log(app.globalData.wxcode),
    //     // 更新数据
    //     that.setData({
    //       userInfo: userInfo,
    //       nickName: userInfo.nickName,
    //       wxcode: app.globalData.wxcode
    //     });
    //     app.globalData.userInfo=userInfo;
    //     let obj = {};
    //     console.log(app.globalData.userInfo);
    //     //头像
    //     obj.avatarUrl = app.globalData.userInfo.avatarUrl;
    //     //性别
    //     obj.gender = app.globalData.userInfo.gender;
    //     //昵称
    //     obj.nickName = app.globalData.userInfo.nickName;
    //     //国家
    //     obj.country = app.globalData.userInfo.country;
    //     //省份
    //     obj.province = app.globalData.userInfo.province;
    //     //城市
    //     obj.city = app.globalData.userInfo.city;


    //     UrlUtil.findJson(properties.getURL(), 'loginIn', { "code": app.globalData.code, "userInfo": obj }).then(d => {
    //       console.log(d);
    //       app.globalData.userId = d.userId;
    //       app.globalData.familyId = d.familyId;
    //       app.globalData.groupMemberId = d.groupMemberId;
    //       if (app.globalData.familyId && app.globalData.groupMemberId) {
    //         wx.reLaunch({ url: '../index/index' })
    //       }
    //     })
    // })
    
    
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(app.globalData.familyId, 2222);
    // console.log(app.globalData.familyId && app.globalData.groupMemberId, 3333);
    // if (app.globalData.familyId && app.globalData.groupMemberId) {
    //   wx.reLaunch({
    //     url: '../index/index',
    //   })
    // }
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})