const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp();
Page({
  data: {
    isSubmit:false,
    model: false,
    groupMemberId: "",
    dataArray: [],
    index: 0,
    date: '',
    time: '',
    warn: false,
    popShow:false,
    flag: 0,
    startTime:"",
    startDate:"",
    dataList1: [
    ],
    do: [
      {
        iconSrc: "../../images/learn@2x.png",
        activeIconSrc: "../../images/icon_study.png",
        txt: "学习",
      },
      {
        iconSrc: "../../images/jiawu@2x.png",
        activeIconSrc: "../../images/icon_jiawu.png",
        txt: "家务"

      },
      {
        iconSrc: "../../images/yundong@2x.png",
        activeIconSrc: "../../images/icon_sport.png",
        txt: "运动"
      },
      {
        iconSrc: "../../images/qita@2x.png",
        activeIconSrc: "../../images/icon_qita.png",
        txt: "其他"
      }
    ],
    changeSrc: "old",
    type: "0101",
    dataList: {
      groupMemberId: null,
      chGroupMemberIds: [],
      iconSrc: "",
      desc: "",
      finishTime: "",
      money: ""
    }
  },
  onLoad:function(e){
    //将当前时间转化为yy-mm-dd hh:mm:ss格式
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (hours >= 0 && hours <= 9) {
        hours = "0" + hours
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
      var currentseconds = hours + seperator2 + minutes;
      return [currentdate, currentseconds];
    }
    var colTime = getNowFormatDate();
    this.setData({
      startDate: colTime[0],
      startTime: colTime[1]
    })
    console.log(this.data.startDate, this.data.startTime)
  },
  //验证表单是否为整数或两位小数
  blur: function (e) {
    var _value = e.detail.value,
      _v;
    if ((/^(([1-9]\d*)|0)(\.\d{1,2})?$/).test(_value)) {
      _v = parseFloat(_value).toFixed(2);
      if (_v <= 9999&&_v>0) {
        e.detail.value = _v;
      } else {
        e.detail.value = "";
      }
      this.data.dataList.money = e.detail.value
      this.setData({
        dataList: this.data.dataList
      })
      // 当flag为0时
      this.setData({
        warn: this.data.warn
      })
      // 当flag为1时
      if (this.data.flag == 1) {
        this.data.flag = 0;
        this.setData({
          warn: !this.data.warn,
          flag: this.data.flag
        })
      }
    } else {
      e.detail.value = "";
      this.data.flag = 1; //当warn为true时,将flag设为1
      this.setData({
        warn: !this.data.warn,
        flag: this.data.flag
      })
      this.data.dataList.money = e.detail.value
      this.setData({
        dataList: this.data.dataList
      })
    }
  },
  //是否显示弹窗及调用宝宝列表查询
  modalTap: function (e) {
    var that = this;
    this.setData({
      model: !this.data.model,
      groupMemberId: app.globalData.groupMemberId
    })
    UrlUtil.findJson(properties.getURL(), "family/children/query", { "groupMemberId": that.data.groupMemberId }).then(d => {
      console.log(d);
      that.setData({
        dataList1: d.dataList,
      })
    })
  },
  // 弹窗表单确认提交
  modFormSubmit: function (e) {
    this.setData({
      model: !this.data.model
    })
    var len = e.detail.value.checkbox.length;
    for (var i = 0; i < len; i++) {
      if (this.isCon(this.data.dataArray, this.data.dataList1[e.detail.value.checkbox[i]].groupMemberId)) {
      } else {
        this.data.dataArray.push(this.data.dataList1[e.detail.value.checkbox[i]]);
      }
    }
    for (var i = 0; i < len; i++) {
      this.data.dataList.chGroupMemberIds.push(this.data.dataArray[i].groupMemberId)
    }
    console.log(this.data.dataList.chGroupMemberIds)
    this.setData({
      dataArray: this.data.dataArray
    })
  },
  //循环遍历作比较是否已经存在
  isCon: function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].groupMemberId == val)
        return true;
    }
    return false;
  },
  // 点击删除接受任务的人
  delPerson: function (e) {
    var index = e.target.dataset.index;
    var dataArrays = this.data.dataArray;
    dataArrays.splice(index, 1);
    this.data.dataList.chGroupMemberIds.splice(index, 1)
    this.setData({
      dataArray: dataArrays
    })
  },
  //点击改变是否选中
  changeSrc: function (e) {
    this.setData({
      changeSrc: e.target.dataset.src
    })
    this.data.dataList.iconSrc = e.target.dataset.currentsrc;
  },
  //pick选择时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //pick选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //派任务表单提交调用创建财务内容接口
  formSubmit: function (e) {
    if (!this.data.isSubmit){
      console.log('正在调用');
      this.setData({
        isSubmit:true
      })
      var that = this;
      var len = this.data.dataArray.length;
      this.data.dataList.groupMemberId = this.data.groupMemberId;
      this.data.dataList.desc = e.detail.value.input;
      this.data.dataList.money = e.detail.value.money;
      this.data.dataList.finishTime = this.data.date + " " + this.data.time + ":00";
      console.log(this.data.dataList.chGroupMemberIds);
      if ((this.data.dataList.groupMemberId != null) && (this.data.dataList.chGroupMemberIds.length != 0) && (this.data.dataList.iconSrc != "") && (this.data.dataList.desc != "") && (this.data.dataList.finishTime != "") && (this.data.dataList.money != "")) {
        console.log(true, 111);
        console.log(this.data.dataList);
        UrlUtil.findJson(properties.getURL(), "taskContent/insert", { "type": that.data.type, "dataList": that.data.dataList }).then(d => {
          if (d.respCode == "0000") {
            wx.reLaunch({
              url: '../index/index',
            })
          }
          that.setData({
            isSubmit:false
          })
        })
      } else {
        this.setData({
          popShow: !this.data.popShow,
          isSubmit:false
        })
        setTimeout(function () {
          that.setData({
            popShow: false
          })
        }, 2000)
        console.log(false, 444)
      }
    }
  }
})
