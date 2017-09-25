// pages/babySet/babySet.js
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp();
Page({
  data: {
    role: ["大宝", "二宝", "三宝"],
    tag1:"",
    tag2:"",
    tag3:"",
    tag1Class:"",
    tag2Class: "",
    tag3Class: "",
    tagDisClass1:"disabled",
    tagDisClass2: "disabled",
    tagDisClass3: "disabled",
    tGroupMemberId:null,
    tagInput:"",
    roleTag:"",
    familyId:"",
    popShow:false,
    popShowText:""
  },
  // 获取参数
  onLoad: function (options) {
    console.log(options);
    // 如果转发人家庭成员id存在
    if (options.tGroupMemberId){
      // if(true){
      let that=this;
      this.setData({
        tGroupMemberId:options.tGroupMemberId,
        familyId: options.familyId
      });
      // 调用家庭成员查询接口
      UrlUtil.findJson(properties.getURL(), 'family/familyMember/query', { "userId": app.globalData.userId, "groupMemberId": this.data.tGroupMemberId, "familyId": this.data.familyId}).then(d => {
        console.log(d.dataList);
        let roleTagAll=[];
        for(let i=0;i<d.dataList.length;i++){
          roleTagAll.push(d.dataList[i].roleTag);         
        }
        // 获得所有成员的标签
        console.log(roleTagAll);
        for (let j = 0; j < that.data.role.length;j++){
          // 如果标签已经使用
          if(!that.isCon(roleTagAll,that.data.role[j])){
            switch (j){
              case 0:
                that.setData({ tag1: "tag1", tagDisClass1:""});
                break;
              case 1: 
                that.setData({ tag2: "tag2", tagDisClass2:""});
                break;
              case 2: 
                that.setData({ tag3: "tag3", tagDisClass3: ""});
                break;
            }
          }
        }
      });
    } else {
      this.setData({
        tagDisClass1: "",
        tagDisClass2: "",
        tagDisClass3: ""
      })
    } 
  },
  isCon:function(arr, val){
    for(var i= 0; i<arr.length; i++){
    if (arr[i] == val)
      return true;
    }
    return false;
	},
  tag1:function(){
    if (!this.data.tagDisClass1){
      this.setData({
        tag1Class: "active",
        tag2Class: "",
        tag3Class: "",
        tagInput: "",
        roleTag: "大宝"
      });
    }
  },
  tag2: function () {
    if (!this.data.tagDisClass2){
      this.setData({
        tag1Class: "",
        tag2Class: "active",
        tag3Class: "",
        tagInput: "",
        roleTag: "二宝"
      });
    }
  },
  tag3: function () {
    if(!this.data.tagDisClass3){
      this.setData({
        tag1Class: "",
        tag2Class: "",
        tag3Class: "active",
        tagInput: "",
        roleTag: "三宝"
      });
    }
  },
  focus:function(){
    this.setData({
      tag1Class: "",
      tag2Class: "",
      tag3Class: "",
      tagInput: "",
      roleTag: ""
    });
  },
  bindKeyInput:function(e){
    this.setData({
      tag1Class: "",
      tag2Class: "",
      tag3Class: "",
      roleTag:e.detail.value
    })
  },
  toAddFamily: function (e) {
    console.log(app.globalData);
    console.log(this.data.roleTag);
    let that=this;
    // if(e.detail.value.input){
    //   this.setData({
    //     roleTag:e.detail.value
    //   })
    // }
    if (!this.data.roleTag) {
      // 如果没选择标签那么就无法跳转到下一页
    } else{
      if (this.data.tGroupMemberId == null) {
        // 调取家庭新增接口获取groupMemberId，存到全局
        UrlUtil.findJson(properties.getURL(), 'family/createFamily', { "userId": app.globalData.userId, "roleType": "01", "roleTag": this.data.roleTag }).then(d => {
          if (d.respCode == "0000"){
            app.globalData.familyId = d.familyId;
            app.globalData.groupMemberId = d.groupMemberId;
            console.dir(app.globalData);
            // 跳转到添加家长页面
            wx.reLaunch({
              url: '../addFamily/addFamily'
            })
          }else{
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
        UrlUtil.findJson(properties.getURL(), 'family/familyMember/insert', { "userId": app.globalData.userId, "roleType": "01", "roleTag": this.data.roleTag, "tGroupMemberId": this.data.tGroupMemberId }).then(d => {
          console.log(d);
          // 如果返回码是0000代表新增成功，跳转到首页
          if (d.respCode=="0000"){
            app.globalData.familyId = d.familyId;
            app.globalData.groupMemberId = d.groupMemberId;
            console.dir(app.globalData);

            // 跳转到首页
            wx.reLaunch({
              url: '../index/index'
            })
            
            // 否则新增失败，退出转发页面
          } else if (d.respCode =="900104"){
           //已存在家庭 
            // 弹出框提示后台信息
            that.setData({
              popShow:true,
              popShowText: d.respMsg + ',请稍等片刻,系统将自动跳到首页'
            });
            // 三秒之后退出
            setTimeout(function(){
              that.setData({
                popShow: false
              });
              wx.reLaunch({
                url: '../index/index',
              })
            }, 3000);
          }else{
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