const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app=getApp();
Page({
  data: {
    isSubmit:false,
    // list: {
      warn: false,
      model:false,
      flag: 0,
      groupMemberId:"",
      chGroupMemberId: "",
      dataOne:{},
      show: false,
      addRole: true,
      popShow:false,
      areaShow: true,
      placeholder:"代收钱描述请不能超过100个汉字哦",
      dataList: [
      ],
      type: "0002",
      content: {
        prGroupMemberId: "",
        chGroupMemberId: "",
        money: "",
        desc: ""
      }
    // }
  },
  //验证表单是否为整数或两位小数
  blur: function (e) {
    var _value = e.detail.value,
      _v;
    if ((/^(([1-9]\d*)|0)(\.\d{1,2})?$/).test(_value)) {
      _v = parseFloat(_value).toFixed(2);
      if(_v<=9999&&_v>0){
        e.detail.value = _v;
      }else{
        e.detail.value = "";
      }
      this.data.content.money = e.detail.value
      this.setData({
        content: this.data.content
      })
      // 当flag为0时
       this.setData({
         warn:this.data.warn
       })
      // 当flag为1时
       if(this.data.flag==1){
         this.data.flag=0;
         this.setData({
           warn: !this.data.warn,
           flag:this.data.flag
         })
       }
    } else {
      e.detail.value = "";
      this.data.flag = 1; //当warn为true时,将flag设为1
      this.setData({
        warn:!this.data.warn,
        flag: this.data.flag
      })
      this.data.content.money = e.detail.value
      this.setData({
        content: this.data.content
      })
    }
  },
   //是否显示弹窗及调用宝宝列表查询接口
  modaTap: function (e) {
    var that=this;
    this.setData({
      model: !this.data.model,
      placeholder:"",
      areaShow:!this.data.areaShow
    })
    UrlUtil.findJson(properties.getURL(), "family/children/query", { "groupMemberId": app.globalData.groupMemberId }).then(d => {
      that.setData({
        dataList: d.dataList
      })
    })
  },
  //弹窗表单确认提交
  modFormSubmit: function (e) {
    this.setData({
      model: !this.data.model,
      placeholder:"代收钱描述请不能超过100个汉字哦",
      areaShow: true
    })
    this.setData({
      dataOne: this.data.dataList[e.detail.value.radio]
    })
    if(this.data.dataOne){
      this.setData({
        show:!this.data.show,
        addRole:!this.data.addRole
      })
    }else{
      this.setData({
        dataOne:{}
      })
    }
  },
  //收钱表单提交调用创建财务内容接口
  formSubmit: function (e) {
    if (!this.data.isSubmit){
      console.log('正在提交');
      this.setData({
        isSubmit:true
      })
      var that = this;
      this.data.content.prGroupMemberId = app.globalData.groupMemberId;
      this.data.content.chGroupMemberId = this.data.dataOne.groupMemberId;
      this.data.content.money = e.detail.value.input;
      this.data.content.desc = e.detail.value.textarea;
      if (this.data.content.prGroupMemberId != "" && this.data.content.money != "" && this.data.content.desc != "") {
        UrlUtil.findJson(properties.getURL(), "FinanceActive/moneyActive", { "type": that.data.type, "content": that.data.content }).then(d => {
          if (d.respCode == "0000") {
            wx.reLaunch({
              url: "../index/index"
            })
          }
          that.setData({
            isSubmit:false
          })
        })
      } else {
        this.setData({
          popShow: !this.data.popShow,
          areaShow: false

        })
        setTimeout(function () {
          that.setData({
            popShow: false,
            areaShow: true,
            isSubmit: false
          })
        }, 2000)
      }
    }
    
  }
})