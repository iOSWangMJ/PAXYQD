const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app=getApp();
Page({
    data:{
      tGroupMemberId:"",
      nickName: "",
      avatarUrl: "",
      familyId:"",
      path: "/pages/roleSelect/roleSelect"
    },
    onLoad:function(options){
      this.setData({
        // 获取之前生成的家庭组成员Id
        tGroupMemberId: app.globalData.groupMemberId,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        familyId: app.globalData.userInfo.familyId
      });
    },
    // 点击添加宝宝按钮之后触发此函数转发
    onShareAppMessage:function(res){
      let that = this;
      let path = "";
      if (res.from === 'button') {
        // 来自页面内转发按钮
        path = '/pages/familyInvite/familyInvite?tGroupMemberId=' + this.data.tGroupMemberId + '&nickName=' + this.data.nickName + '&avatarUrl=' + this.data.avatarUrl + '&familyId=' + this.data.familyId;
        this.setData({
          path:path
        })
      }
      console.log('path' + that.data.path);
      return {
        title: '小友钱袋邀请',
        path: that.data.path,
        success: function (res) {
          // 转发成功
          UrlUtil.findJson(properties.getURL(), 'family/share/insert', { "groupMemberId": app.globalData.groupMemberId, "roleType": "01" })
            .then(d => {
              console.info(d);
              if (d.respCode === "0000") {
                // 调用转发接口成功之后跳转到首页
                console.info("  // 调用转发接口成功之后跳转到首页");
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
        },
        fail: function (res) {
          // 转发失败
        },
        complete: function (res) {
          console.log('转发结束');
        }
      }
    }
})