const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp();
Page({
  data: {
    path: '/pages/enter/enter',//默认
    roleType: '02'
  },
  onShareAppMessage: function (res) {
    let that = this;
    let roleType = "";
    let path = "";
    if (res.from === 'button') {
      // 来自页面内转发按钮
      switch (res.target.id) {
        //宝宝按钮
        case "toBaby":
          roleType = "01";
          path = '/pages/familyInvite/familyInvite?tGroupMemberId=' + app.globalData.groupMemberId + "&&familyId=" + app.globalData.familyId + "&&nickName=" + app.globalData.userInfo.nickName + "&&avatarUrl=" + app.globalData.userInfo.avatarUrl;
          break;
        //家长按钮
        case "toParent":
          roleType = "00";
          path = '/pages/babyInvite/babyInvite?tGroupMemberId=' + app.globalData.groupMemberId + "&&familyId=" + app.globalData.familyId + "&&nickName=" + app.globalData.userInfo.nickName + "&&avatarUrl=" + app.globalData.userInfo.avatarUrl;
          break;
        //朋友按钮
        case "toFriend":
          roleType = "02";
          path = '/pages/enter/enter'
          break;
      }
      this.setData({
        roleType,
        path
      })
    }
    return {
      title: app.globalData.userInfo.nickName + '邀请您使用小友钱袋',
      path: that.data.path,
      success: function (res) {
        console.log(that.data.path)
        // 转发成功
        UrlUtil.findJson(properties.getURL(), 'family/share/insert', { "groupMemberId": app.globalData.groupMemberId, "roleType": that.data.roleType })
          .then(d => {
            if (d.respCode === "0000") {
            }
          })
      },
      fail: function (res) {
        // 转发失败
      },
      complete: function (res) {
        that.setData({
          roleType: '02',
          path: '/pages/enter/enter'
        })
      }
    }
  }
});