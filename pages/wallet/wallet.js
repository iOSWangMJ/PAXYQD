const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp()
Page({
  data:{
    topHeadImage: "",
    topTag:"",
    topChildId:"",
    parHeadImage:"",
    parTag:"",
    parId:"",
    sum:"",
    rateYestSum:"",
    rateMonth:"",
    runningWallet:"../../images/businessIcon/qiandailiushui.png",
    divideImage:"../../images/businessIcon/tabbar_longline.png",
    dataList:[],
    // 向后台请求的次数
    time: 0,
    count: 0
  },
  // 获取参数
  onLoad: function (options) {
    console.log('ddddd');
    console.dir(options);
    let that = this;
    this.setData({
      topChildId: options.childId,
      parId: options.parId,
      topHeadImage: options.childImage,
      parHeadImage: options.parImage,
      topTag: options.childTag,
      parTag: options.roleTag
    });
    // 调用宝宝钱袋查询接口
    // UrlUtil.findJson(properties.getURL(), 'FinanceActive/childrenWallet/query', { "prGroupMemberId": this.data.parId, "chGroupMemberId": this.data.topChildId, "startIndex": 0, "numPerPage": 7}).then(d => {
    UrlUtil.findJson(properties.getURL(), 'FinanceActive/childrenWallet/query', { "prGroupMemberId": this.data.parId, "chGroupMemberId": this.data.topChildId}).then(d => {
      console.log(d);
      that.setData({
        sum: d.totalMoney,
        rateYestSum: d.lucre,
        rateMonth: d.changeMoney,
        dataList: d.dataList,
        // count: parseInt(d.count),
        // time: 0
      });
    });
  },
  // 滚动到顶部触发的事件
  // upper: function () {
  //   console.log('滚动到顶部触发的事件');
  //   let that = this;
  //   UrlUtil.findJson(properties.getURL(), 'FinanceActive/childrenWallet/query', { "prGroupMemberId": this.data.parId, "chGroupMemberId": this.data.topChildId, "startIndex": 0, "numPerPage": 7 }).then(d => {
  //     console.log(d);
  //     that.setData({
  //       sum: d.totalMoney,
  //       rateYestSum: d.lucre,
  //       rateMonth: d.changeMoney,
  //       dataList: d.dataList,
  //       count: parseInt(d.count),
  //       time: 0
  //     });
  //     console.log("that.data.dataList.length：" + that.data.dataList.length);
  //   });
  // },
  // 滚动到底部触发的事件
  // lower: function () {
  //   console.log('滚动到底部触发的事件');
  //   console.log("count:" + this.data.count);
  //   console.log("this.data.dataList.length:" + this.data.dataList.length);
  //   // 如果目前获取的数据个数小于总数，则可以继续向后台拿数据
  //   if (this.data.dataList.length < this.data.count) {

  //     let startIndex = (this.data.time + 1) * 7;
  //     let that = this;
  //     let transit = [];
  //     UrlUtil.findJson(properties.getURL(), 'FinanceActive/childrenWallet/query', { "prGroupMemberId": this.data.parId, "chGroupMemberId": this.data.topChildId, "startIndex": startIndex, "numPerPage": 7 }).then(d => {
  //       console.log(d);
  //       transit = d.dataList;
  //       that.setData({
  //         sum: d.totalMoney,
  //         rateYestSum: d.lucre,
  //         rateMonth: d.changeMoney,
  //         dataList: this.data.dataList.concat(transit),
  //         time: this.data.time + 1,
  //         count: parseInt(d.count)
  //       });
  //       console.log("that.data.dataList.length：" + that.data.dataList.length);
  //       console.log(that.data.dataList);
  //     });
  //   }
  // },
  // 点击头像跳入当前头像人员的个人详情页
  goPerson:function(event){
    console.log(event.currentTarget.dataset.id);
    wx.reLaunch({
      url: '../personalInfo/personalInfo?groupMemberId=' + event.currentTarget.dataset.id
    });
  },
  //时间排序
  sortByTime: function (createTime) {
    let arr = createTime.split(' ');
    let date = arr[0];
    let time = arr[1];
    let handleDate = date.split('-');
    let handleTime = time.split(':');
    let result = handleDate[0] + handleDate[1] + handleDate[2] + handleTime[0] + handleTime[1] + handleTime[2];
    return result;
  }
  
})