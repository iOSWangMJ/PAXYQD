const uploadFileUrl = require('../../config').uploadFileUrl
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp();
Page({
  data: {
    left: "",
    upLeft: "",
    textareaValue: "",
    tempFilePaths: [],
    isSubmit: false
  },
  onLoad: function () {

  },
  //点击讨红包
  handleClickAskFor(e) {
    if (!this.data.isSubmit) {
      this.setData({
        isSubmit: true
      })
      console.log('正在提交');
      let that = this;
      let content = {};
      content.chGroupMemberId = app.globalData.groupMemberId;
      content.desc = e.detail.value.textarea;
      let imageUrl = [];
      let i = 0;
      //递归上传
      let upload = function () {
        if (i < that.data.tempFilePaths.length) {
          wx.uploadFile({
            url: 'https://www.qingfanyun.cn/WxRedPacketCompress/upload',
            filePath: that.data.tempFilePaths[i],
            name: 'filename',
            success: function (res) {
              console.log(res.data)
              let json = JSON.parse(res.data);
              if(json.respCode === "0000"){
                let obj = {
                  oriImage: 'https://www.qingfanyun.cn/' + json.fileName,
                  shrImage: ''
                }; 
                imageUrl.push(obj);
              }
              i++;
              upload();
            }
          })
        } else {
          content.imageUrl = imageUrl;
          // 跳转首页 并且插入数据
          UrlUtil.findJson(properties.getURL(), 'FinanceActive/moneyActive', {
            "type": "0104",
            content: content
          })
            .then(d => {
              console.log(d);
              if (d.respCode === "0000") {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
              that.setData({
                isSubmit: false
              })
          })
        }
      }
      // 选择图片大于0调用递归
      if (that.data.tempFilePaths.length > 0) {
        upload();
      } else {
        content.imageUrl = imageUrl;
        UrlUtil.findJson(properties.getURL(), 'FinanceActive/moneyActive', {
          "type": "0104",
          content: content
        })
          .then(d => {
            console.log(d);
            if (d.respCode === "0000") {
              wx.reLaunch({
                url: '../index/index',
              })
            }
            that.setData({
              isSubmit:false
            })
          })
      }
    }
  },
  // 选择图片
  chooseImage: function () {
    var self = this
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      count: 3,
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        self.setData({
          tempFilePaths
        })
      }
    })
  },
})