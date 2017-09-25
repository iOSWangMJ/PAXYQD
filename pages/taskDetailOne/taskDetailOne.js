const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp();
Page({
  data: {
    showModalStatus: false,
    closed: [],
    completed: [],
    inSwing: [],
    applyComplete: [],
    IconSrc: "",
    submitTime: "",
    money: '',
    desc: '',
    finishTime: "",
    timer: null,
    timer: '',
    day: '',
    isConfirm: false
  },
  onLoad: function (options) {
    let that = this;
    UrlUtil.findJson(properties.getURL(), 'family/taskDetail/query', { "taskId": options.taskId })
      .then(d => {
        if (d.respCode === "0000") {
          console.log(d);
          //进行中
          let inSwing = [];
          //申请完成
          let applyComplete = [];
          //已关闭
          let closed = [];
          //已完成
          let completed = [];
          d.dataList.forEach((val) => {
            switch (val.taskState) {
              case '01':
                inSwing.push(val);
                break;
              case '02':
                applyComplete.push(val);
                break;
              case '03':
                closed.push(val);
                break;
              case '04':
                completed.push(val);
                break;
            }
          })
          that.setData({
            inSwing,
            applyComplete,
            closed,
            completed,
            taskId: options.taskId,
            finishTime: d.finishTime,
            money: d.money,
            IconSrc: d.iconSrc,
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
  //初次渲染
  onReady: function () {
  },
  onShow: function () {
  },
  //页面卸载
  onUnload: function () {
    //清除定时器
    clearInterval(this.data.timer);
  },
  //点击确认
  handleClickConfirm: function (event) {
    if (!this.data.isConfirm) {
      let that = this;
      console.log('正在提交');
      this.setData({
        isConfirm: true
      })
      UrlUtil.findJson(properties.getURL(), 'taskContent/confirm', {
        "taskId": event.currentTarget.dataset.taskid,
        "chGroupMemberId": event.currentTarget.dataset.chgroupmemberid,
        "groupMemberId": app.globalData.groupMemberId
      })
        .then(d => {
          //确认完成返回首页
          if (d.respCode === "0000") {
            wx.reLaunch({
              url: '../index/index',
            })
          } else {
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
  },
  //点击关闭
  handleClickRepeat: function (event) {
    UrlUtil.findJson(properties.getURL(), 'taskState/update', {
      "taskId": event.currentTarget.dataset.taskid,
      "chGroupMemberId": event.currentTarget.dataset.chgroupmemberid,
      "newTaskState": "03"
    })
      .then(d => {
        //返回首页
        if (d.respCode === "0000") {
          wx.reLaunch({
            url: '../index/index',
          })
        }
      })
  },
  //浏览图片
  // handleBrowserImg: function (event) {
  //   let images = [];
  //   event.currentTarget.dataset.images.forEach((val) => {
  //     images.push(val.oriImage);
  //   })
  //   wx.previewImage({
  //     current: images[event.currentTarget.dataset.index], // 当前显示图片的http链接
  //     urls: images // 需要预览的图片http链接列表
  //   })
  // },

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