const uploadFileUrl = require('../../config').uploadFileUrl
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')

var app = getApp();
Page({
  data: {
    showModalStatus: false,
    IconSrc: "",
    avatarUrl: [],
    finishTime: "",
    time: "",
    money: "",
    confirm: "确认完成",
    //清除浮动
    timer: null,
    //上传图片地址
    tempFilePaths: [],
    //详情描述
    desc: '',
    //任务id
    taskId: '',
    day: '',
    textAreaDesc: '',
    isConfirm: false,
  },
  onLoad: function (options) {
    var that = this;
    UrlUtil.findJson(properties.getURL(), 'family/taskDetail/query', { "taskId": options.taskId })
      .then(d => {
        console.log(d);
        if (d.respCode === "0000") {
          that.setData({
            taskId: options.taskId,
            finishTime: d.finishTime,
            money: d.money,
            IconSrc: d.iconSrc,
            avatarUrl: [d.avatarUrl, app.globalData.userInfo.avatarUrl],
            desc: d.desc
          })
          var finishTime = d.finishTime;
          this.data.timer = setInterval(function () {
            var datenow = new Date();
            var now = datenow.getTime();
            var dateend = new Date(finishTime.replace(new RegExp("-", "gm"), "/"));
            var end = dateend.getTime();
            var leftTime = end - now;
            var d, h, m, s;
            //大于0
            if (leftTime >= 0) {
              d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
              h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
              if (h < 10) {
                h = "0" + h;
              }
              m = Math.floor(leftTime / 1000 / 60 % 60);
              if (m < 10) {
                m = "0" + m;
              }
              s = Math.floor(leftTime / 1000 % 60);
              if (s < 10) {
                s = "0" + s;
              }
              let time = h + ":" + m + ":" + s;
              let day = d + "天";
              that.setData({
                time: time,
                day: day
              })
            } else {
              that.setData({
                time: '00:00:00',
                day: '0天'
              })
              that.util('open');
              clearInterval(that.data.timer);
            }
          }, 1000);
        }
      })
  },
  //页面显示
  onReady: function () {
    // app.startInterval(this.data.finishTime,this);
  },
  onShow: function () {

  },
  //页面卸载
  onUnload: function () {
    //清除定时器
    clearInterval(this.data.timer);
  },
  chooseImage: function () {
    var self = this
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      count: 3,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          tempFilePaths
        })
      }
    })
  },
  //textArea失去焦点赋值
  handleTextAreaBlur: function (event) {
    if (event.detail.value) {
      this.setData({
        textAreaDesc: event.detail.value
      })
    }
  },
  //点击提交按钮
  handleConfirm: function (e) {
    if (!this.data.isConfirm) {
      console.log('正在提交');
      let that = this;
      this.setData({
        isConfirm: true,
      })
      let dataList = {
        groupMemberId: app.globalData.groupMemberId,
        desc: e.detail.value.textarea,
        taskId: that.data.taskId
      }
      var imageUrl = [];
      var i = 0;
      //递归上传
      var upload = function () {
        if (i < that.data.tempFilePaths.length) {
          wx.uploadFile({
            url: 'https://www.qingfanyun.cn/WxRedPacketCompress/upload',
            filePath: that.data.tempFilePaths[i],
            name: 'filename',
            success: function (res) {
              console.log(res.data)
              let json = JSON.parse(res.data);
              if (json.respCode === "0000") {
                console.log(res);
                let obj = {
                  oriImage: 'https://www.qingfanyun.cn/' + json.fileName,
                  shrImage: ''
                };
                imageUrl.push(obj);
                i++;
                upload();
              }
            }
          })
        } else {
          //跳转首页 并且插入数据
          dataList.imageUrl = imageUrl;

          //发送到后台
          UrlUtil.findJson(properties.getURL(), 'taskContent/insert', { "type": '0102', "dataList": dataList })
            .then(d => {
              if (d.respCode === "0000") {
                wx.reLaunch({
                  url: '../index/index',
                })
              } else {
                //报错跳转首页
                // wx.showToast({
                //   title: '服务器异常,请稍后再试,错误代码' + d.respCode,
                //   icon: 'loading',
                //   duration: 2000
                // })
                // that.setData({
                //   isConfirm: false
                // })
                // wx.reLaunch({
                //   url: '../index/index',
                // })
              }
            })
        }
      }
      //选择图片大于0调用递归
      if (that.data.tempFilePaths.length > 0) {
        upload();
      } else {
        //跳转首页 并且插入数据
        dataList.imageUrl = imageUrl;

        //发送到后台
        UrlUtil.findJson(properties.getURL(), 'taskContent/insert', { "type": '0102', "dataList": dataList })
          .then(d => {
            if (d.respCode === "0000") {
              wx.reLaunch({
                url: '../index/index',
              })
            } else {
              //报错跳转首页
              wx.showToast({
                title: '服务器异常,请稍后再试,错误代码' + d.respCode,
                icon: 'loading',
                duration: 2000
              })
              that.setData({
                isConfirm: false
              })
            }
          })
      }
    }
    
  },


  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    wx.reLaunch({
      url: '../index/index',
    })
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})