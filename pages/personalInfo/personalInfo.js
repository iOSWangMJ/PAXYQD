// Douban API 操作
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp()
Page({
  data: {
    groupMemberId:"",
    rateWidth:"",
    popValue:"",
    // 弹出框的显示与否
    popShow:false,
    topHeadImage:"",
    topTag:"",
    isParent:null,
    walletNotNull:true,
    taskNotNull: true,
    sum:"",
    taskSum:"",
    topRate:"",
    // 钱袋标签无需更改
    walletImagePar:"../../images/businessIcon/qiandai@2x.png",
    walletImageChild: "../../images/businessIcon/wodeqiandai@2x.png",
    // 任务标签
    taskTag:'../../images/businessIcon/renwu@2x.png',
    // 写死的文字部分无需动态修改
    depositPar:"宝宝存款",
    depositChild:"存款",
    // 分割线图片地址
    divideImage:"../../images/businessIcon/tabbar_longline.png",
    // 与后台交互获取到的数据
    walletDeatil:[],
    taskDetail:[]
  },
  // 页面打开时调用个人详情页接口获取数据
  onLoad:function(options){
    console.log("页面打开时调用个人详情页接口获取数据");
    console.log(options);
    let that = this;
    this.setData({
      groupMemberId: options.groupMemberId
    });
    UrlUtil.findJson(properties.getURL(), 'family/detail/query', { "groupMemberId": that.data.groupMemberId,"startIndex": 0, "numPerPage": 10})
      .then(d => {
        console.log(d);
        // 如果正确返回则执行
        if (d.respCode=="0000"){
          // 假如返回的钱袋记录为空，那么显示图片
          if (d.myWallet.length == 0) {
            that.setData({
              walletNotNull: false
            })
          }
          // 假如返回的任务记录为空，那么显示图片
          if (d.myTask.length == 0) {
            that.setData({
              taskNotNull: false
            })
          }
          // 判断是家长还是宝宝
          if (d.roleType == "00") {
            that.setData({
              isParent: true,
            })
            // 如果是家长再查询此人的利率并展示
            UrlUtil.findJson(properties.getURL(), 'FinanceActive/rate/query', { "groupMemberId": that.data.groupMemberId }).then(d => {
              console.log(d);
              that.setData({
                topRate: d.rate,
              });
            });
          } else {
            that.setData({
              isParent: false,
            })
          }
          // 设置数据到当前页面
          that.setData({
            topTag: d.roleTag,
            sum: d.deposit,
            taskSum: d.taskSum,
            walletDeatil: d.myWallet,
            taskDetail: d.myTask,
            topHeadImage: d.avatarUrl
          })
        }else{
          wx.showToast({
            title: d.respMsg,
            image:'../../images/error.png',
            duration: 3000
          })
        }
      })
  },
  // 点击修改利率部分触发的函数
  rateChange:function(){
    console.log("rateChange");
    // 判断当前打开的个人详情页是否是打开小程序人员的个人详情页
    if (this.data.groupMemberId != app.globalData.groupMemberId){
      // 如果不是本人的个人详情页，怎不显示修改利率页面
      this.setData({ popShow: false });
    }else{
      // 否则显示修改利率页面
      this.setData({ popShow: true });
      var width;
      console.log(this.data.topRate);
      this.setData({ popValue: this.data.topRate });
      if (this.data.topRate != "5") {
        width = "width:" + this.data.topRate * 112 + "rpx";
        console.log(width);
        this.setData({ rateWidth: width });
      } else {
        width = "width:" + this.data.topRate * 112 + "rpx;border-top-right-radius:30rpx;border-bottom-right-radius:30rpx;";
        this.setData({ rateWidth: width });
      }
    }
  },
  // 点击钱袋明细触发的函数
  goWallet:function(event){
    console.log(event.currentTarget.dataset);
    let id = event.currentTarget.dataset.id;
    let avatarUrl = event.currentTarget.dataset.avatarurl;
    let roleTag=event.currentTarget.dataset.roletag;
    let money = event.currentTarget.dataset.money;
    money=parseInt(money);
    // 如果当前存款不为0，则跳到宝宝明细页面
    if(money!=0){

      // 如果当前是家长身份，那么当前的userId赋值给到parId
      if (this.data.isParent) {
        wx.navigateTo({
          url: '../wallet/wallet?parId=' + this.data.groupMemberId + '&parImage=' + this.data.topHeadImage + '&parTag=' + this.data.topTag + '&childId=' + id + '&childImage=' + avatarUrl + '&childTag=' + roleTag
        });
        // 如果当前不是家长身份，那么当前的userId赋值给到parId
      } else {
        wx.navigateTo({
          url: '../wallet/wallet?parId=' + id + '&parImage=' + avatarUrl + '&parTag=' + roleTag + '&childId=' + this.data.groupMemberId + '&childImage=' + this.data.topHeadImage + '&childTag=' + this.data.topTag
        });
      }

    }
  },
  // 点击更多任务绑定的事件,跳转到任务详情页
  taskMore:function(){
    console.log("taskMore");
    wx.navigateTo({
      url: '../taskList/taskList?groupMemberId=' + this.data.groupMemberId + '&isParent=' + this.data.isParent
    });
  },
  //关闭所有页面，打开到应用内的个人页面
  goPerson:function(event){
    console.log(event.currentTarget.dataset.id);
    let id = event.currentTarget.dataset.id;
    console.log(event);
    wx.redirectTo({
      url: 'personalInfo?groupMemberId=' + id
    });
  },
  // 选择利率
  sliderChange:function(event){
    console.log(event.detail);   
    var width; 
    if (event.detail.value.toString()!="5"){
      width = "width:" + event.detail.value * 112 + "rpx";
    } else{
      width = "width:" + event.detail.value * 112 + "rpx;border-top-right-radius:30rpx;border-bottom-right-radius:30rpx;";
    };
    this.setData({
      rateWidth: width,
      topRate: event.detail.value.toString()
    });
  },
  // 提交设置好的利率调用
  popRateChange:function(){
    console.log("popRateChange");
    let that=this;
    console.log(this.data.groupMemberId);
    UrlUtil.findJson(properties.getURL(), 'FinanceActive/rate/update', { "groupMemberId": that.data.groupMemberId,"rate": that.data.topRate})
      .then(d => {
        console.log(d);
        if (d.respCode=="0000"){
          console.log("修改成功");
        }
        // 更新详情页利率显示信息
        UrlUtil.findJson(properties.getURL(), 'FinanceActive/rate/query', { "groupMemberId": that.data.groupMemberId }).then(d => {
          console.log(d);
          that.setData({
            topRate: d.rate,
          });
        });
      })
    // 隐藏弹出框
    this.setData({ popShow: false });
  },
  popClose:function(){
    // 隐藏弹出框
    this.setData({ popShow: false });
  },
  // 跳转到首页
  goHome:function(){
    console.log("goHome");
    wx.reLaunch({
      url: '../index/index'
    });
  }
})

