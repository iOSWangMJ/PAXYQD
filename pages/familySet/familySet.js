const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app=getApp();
Page({
  data:{
    role:["爸爸","妈妈","爷爷","奶奶","外公","外婆"],
    tag1: "",
    tag2: "",
    tag3: "",
    tag4: "",
    tag5: "",
    tag6: "",
    tag1Class: "",
    tag2Class: "",
    tag3Class: "",
    tag4Class: "",
    tag5Class: "",
    tag6Class: "",
    tagDisClass1: "disabled",
    tagDisClass2: "disabled",
    tagDisClass3: "disabled",
    tagDisClass4: "disabled",
    tagDisClass5: "disabled",
    tagDisClass6: "disabled",
    tGroupMemberId: null,
    tagInput: "",
    roleTag: "",
    familyId: "",
    popShow: false,
    popShowText:""
  },
  onLoad:function(options){
    // 如果转发人家庭成员id存在
    // options.tGroupMemberId = "25236";
    if (options.tGroupMemberId) {
      let that = this;
      this.setData({
        tGroupMemberId: options.tGroupMemberId,
        familyId: options.familyId
      });
      console.log(options);
      // 调用家庭成员查询接口
      UrlUtil.findJson(properties.getURL(), 'family/familyMember/query', { "userId": app.globalData.userId, "groupMemberId": this.data.tGroupMemberId, "familyId": this.data.familyId }).then(d => {
        console.log(d);
        let roleTagAll = [];
        for (let i = 0; i < d.dataList.length; i++) {
          roleTagAll.push(d.dataList[i].roleTag);
        }
        // 获得所有成员的标签
        console.log(roleTagAll);
        for (let j = 0; j < that.data.role.length; j++) {
          // 如果标签已经使用
          if (!that.isCon(roleTagAll, that.data.role[j])) {
            switch (j) {
              case 0:
                that.setData({ tag1: "tag1", tagDisClass1: "" });
                break;
              case 1:
                that.setData({ tag2: "tag2", tagDisClass2: "" });
                break;
              case 2:
                that.setData({ tag3: "tag3", tagDisClass3: "" });
                break;
              case 3:
                that.setData({ tag4: "tag4", tagDisClass4: "" });
                break;
              case 4:
                that.setData({ tag5: "tag5", tagDisClass5: "" });
                break;
              case 5:
                that.setData({ tag6: "tag6", tagDisClass6: "" });
                break;
            }
          }
        }
      });
    } else{
      this.setData({
        tagDisClass1: "",
        tagDisClass2: "",
        tagDisClass3: "",
        tagDisClass4: "",
        tagDisClass5: "",
        tagDisClass6: ""
      })
    }
  },
  isCon: function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val)
        return true;
    }
    return false;
  },
  tag1: function () {
    if(!this.data.tagDisClass1){
      this.setData({
        tag1Class: "active",
        tag2Class: "",
        tag3Class: "",
        tag4Class: "",
        tag5Class: "",
        tag6Class: "",
        tagInput: "",
        roleTag: "爸爸"
      });
    }
  },
  tag2: function () {
    if(!this.data.tagDisClass2){
      this.setData({
        tag1Class: "",
        tag2Class: "active",
        tag3Class: "",
        tag4Class: "",
        tag5Class: "",
        tag6Class: "",
        tagInput: "",
        roleTag: "妈妈"
      });
    }
  },
  tag3: function () {
    if(!this.data.tagDiscClass3){
      this.setData({
        tag1Class: "",
        tag2Class: "",
        tag3Class: "active",
        tag4Class: "",
        tag5Class: "",
        tag6Class: "",
        tagInput: "",
        roleTag: "爷爷"
      });
    }
  },
  tag4: function () {
    if (!this.data.tagDiscClass4) {
      this.setData({
        tag1Class: "",
        tag2Class: "",
        tag3Class: "",
        tag4Class: "active",
        tag5Class: "",
        tag6Class: "",
        tagInput: "",
        roleTag: "奶奶"
      });
    }
  },
  tag5: function () {
    if (!this.data.tagDiscClass5) {
      this.setData({
        tag1Class: "",
        tag2Class: "",
        tag3Class: "",
        tag4Class: "",
        tag5Class: "active",
        tag6Class: "",
        tagInput: "",
        roleTag: "外公"
      });
    }
  },
  tag6: function () {
    if (!this.data.tagDiscClass6) { 
      this.setData({
        tag1Class: "",
        tag2Class: "",
        tag3Class: "",
        tag4Class: "",
        tag5Class: "",
        tag6Class: "active",
        tagInput: "",
        roleTag: "外婆"
      });
    }
  },
  focus: function () {
    this.setData({
      tag1Class: "",
      tag2Class: "",
      tag3Class: "",
      tag4Class: "",
      tag5Class: "",
      tag6Class: "",
      tagInput: "",
      roleTag: ""
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      tag1Class: "",
      tag2Class: "",
      tag3Class: "",
      tag4Class: "",
      tag5Class: "",
      tag6Class: "",
      roleTag: e.detail.value
    })
    // console.log(this.data.inputValue);
  },
  toAddBaby:function(){
    console.log('全局userId');
    console.log(app.globalData.userId);
    let that=this;
    if(this.data.roleTag==""){
      // 如果没选择标签那么就无法跳转到下一页
    }else{
      if (this.data.tGroupMemberId == null) {
        // 调取家庭新增接口获取groupMemberId，存到全局
        UrlUtil.findJson(properties.getURL(), 'family/createFamily', { "userId": app.globalData.userId, "roleType": "00", "roleTag": this.data.roleTag }).then(d => {
          if (d.respCode == "0000"){
            console.log(d);
            app.globalData.familyId = d.familyId;
            app.globalData.groupMemberId = d.groupMemberId;
            console.dir(app.globalData);
            // 跳转到添加家长页面
            wx.reLaunch({
              url: '../addBaby/addBaby'
            })
          } else {
            // 弹出框提示后台信息
            that.setData({
              popShow: true,
              popShowText: "系统繁忙,请稍后再试"
            });
            // 三秒之后退出
            setTimeout(function () {
              that.setData({
                popShow: false
              });
            }, 3000);
          } 
        });        
      } else {
        // 调取家庭成员新增接口
        UrlUtil.findJson(properties.getURL(), 'family/familyMember/insert', { "userId": app.globalData.userId, "roleType": "00", "roleTag": this.data.roleTag, "tGroupMemberId": this.data.tGroupMemberId }).then(d => {
          // 如果返回码是0000代表新增成功，跳转到首页
          if (d.respCode == "0000") {
            app.globalData.familyId = d.familyId;
            app.globalData.groupMemberId = d.groupMemberId;
            console.dir(app.globalData);
            // 跳转到首页
            wx.reLaunch({
              url: '../index/index'
            })
            // 否则新增失败，退出转发页面
          } else if (d.respCode == "900104") {
            // 弹出框提示后台信息
            that.setData({
              popShow: true,
              popShowText: d.respMsg + ',请稍等片刻,系统将自动跳到首页'
            });
            // 三秒之后退出
            setTimeout(function () {
              that.setData({
                popShow: false
              });
              wx.reLaunch({
                url: '../index/index',
              })
            }, 3000);
          } else {
            that.setData({
              popShow: true,
              popShowText: '服務器繁忙'
            });
            // 三秒之后退出
            setTimeout(function () {
              that.setData({
                popShow: false
              });
            }, 3000);
          }
        });
      }
    }
  }
})