// pages/home/home.js
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    familyId:'',
    groupMemberId:'',
    parents:[],
    children:[],
    haveChild:false,
    roleType:'02',
    path:'/pages/enter/enter'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let strParents = wx.getStorageSync('parents');
    if(strParents){
      this.setData({
        parents:strParents
      })
    }
    this.setData({
      userId: app.globalData.userId,
      familyId: app.globalData.familyId,
      groupMemberId: app.globalData.groupMemberId,
    })
    //调用家长查询设置家长头像和昵称
    UrlUtil.findJson(properties.getURL(), 'family/familyMember/query', { "userId": this.data.userId, "groupMemberId": this.data.groupMemberId, "familyId": this.data.familyId })
      .then(d => {
        console.log(d);
        if(d.respCode==="0000"){
          let parents = [];
          d.dataList.forEach((val) => {
            if (val.roleType === '00') {
              parents.push(val);
            }
            //  else if (val.roleType === '01') {
            //   console.log(val);
            //   that.setData({
            //     haveChild: true
            //   })
            // }
            console.log("parents" + parents);
          })
          console.log(strParents);
          if(!strParents||parents.length !== strParents.length){
            console.log('设置缓存');
            wx.setStorageSync('parents', parents);
            that.setData({
              dataList: d.dataList,
              parents: parents
            })
          }
        }
      })
    //调用详情查询接口 设置宝宝详情
    UrlUtil.findJson(properties.getURL(), 'family/children/query', { "groupMemberId": this.data.groupMemberId })
      .then(d => {
        if (d.respCode === "0000") {
          console.log('宝宝')
          console.log(d);
          let children = [];
          d.dataList.forEach((val) => {

            let obj = {};
            obj.roleTag = val.roleTag;
            obj.avatarUrl = val.avatarUrl;
            obj.deposit = val.totalMoney;
            obj.taskSum = val.taskAmount;
            obj.lucre = val.lucre;
            obj.groupMemberId = val.groupMemberId
            children.push(obj);

          })
          that.setData({
            children: children,
          })
        }
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  onShareAppMessage: function (res) {
    let that = this;
    let roleType = "02";
    let path = "/pages/enter/enter";
    if (res.from === 'button') {
      // 来自页面内转发按钮
      switch (res.target.id) {
        case "toBaby":
        console.log(1);
          roleType = "01";
          path = '/pages/familyInvite/familyInvite?tGroupMemberId=' + app.globalData.groupMemberId + "&&familyId=" + app.globalData.familyId + "&&nickName=" + app.globalData.userInfo.nickName + "&&avatarUrl=" + app.globalData.userInfo.avatarUrl;
          break;
        case "toParent":
          console.log(2);
          roleType = "00";
          path = '/pages/babyInvite/babyInvite?tGroupMemberId=' + app.globalData.groupMemberId + "&&familyId=" + app.globalData.familyId + "&&nickName=" + app.globalData.userInfo.nickName + "&&avatarUrl=" + app.globalData.userInfo.avatarUrl;
          break;
      }
      this.setData({
        roleType,
        path
      })
    }
    return {
      title: app.globalData.userInfo.nickName + '邀请您一起玩小友钱袋!',
      path: that.data.path,
      success: function (res) {
        console.log(that.data.path);
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
  },
  //有宝宝时,点击宝宝框跳转个人详情页
  handleClickChild:function(event){
    console.log(event);
    wx.redirectTo({
      url: '../personalInfo/personalInfo?groupMemberId=' + this.data.children[event.currentTarget.dataset.index].groupMemberId,
    })
  }
})