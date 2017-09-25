const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
var app = getApp()
Page({
  data:{
    // 虚拟后台返回的数据
    dataList:[],
    // 当前被查询任务列表的人员的Id
    personId:"",
    isParent:null,
    taskNotNull:true,
    // 向后台请求的次数
    time:0,
    count:0
  },
  // 调取任务列表查询接口
  onLoad:function(options){
    // console.log(app.globalData.groupMemberId);
    let that=this;
    console.log(options.isParent);
    this.setData({
      personId: options.groupMemberId,
      isParent: options.isParent
    });
    UrlUtil.findJson(properties.getURL(), 'taskQuery/list', { "groupMemberId": this.data.personId, "startIndex": 0,"numPerPage":7}).then(d => {
      console.log(d);
      that.setData({
        dataList:d.dataList,
        count:parseInt(d.count)
      });
      console.log(that.data.dataList);
    });
  },
  // 滚动到顶部触发的事件
  upper:function(){
    console.log('滚动到顶部触发的事件');
    let that=this;
      UrlUtil.findJson(properties.getURL(), 'taskQuery/list', { "groupMemberId": this.data.personId, "startIndex": 0, "numPerPage": 7 }).then(d => {
        console.log(d);
        that.setData({
          dataList: d.dataList,
          count: parseInt(d.count),
          time:0
        });
        console.log(that.data.dataList);
      });    
  },
  // 滚动到底部触发的事件
  lower:function(){
    console.log('滚动到底部触发的事件');
    console.log("count:"+this.data.count);
    console.log("this.data.dataList.length:" + this.data.dataList.length);
    // 如果目前获取的数据个数小于总数，则可以继续向后台拿数据
    if(this.data.dataList.length<this.data.count){

      let startIndex = (this.data.time+1) * 7;
      let that = this;
      let transit = [];
      UrlUtil.findJson(properties.getURL(), 'taskQuery/list', { "groupMemberId": this.data.personId, "startIndex": startIndex, "numPerPage": 7 }).then(d => {
        console.log(d);
        transit = d.dataList;
        that.setData({
          dataList: this.data.dataList.concat(transit),
          time: this.data.time + 1,
          count: parseInt(d.count)
        });
        console.log("that.data.dataList.length："+that.data.dataList.length);
        console.log(that.data.dataList);
      });

    }
  },
   // 点击头像跳转到个人详情页
  goPerson: function (event) {
    console.log(event.currentTarget.dataset.id);
    let id = event.currentTarget.dataset.id;
    console.log(event);
    // 关闭所有页面，打开到应用内的个人页面
    wx.reLaunch({
      url: '../personalInfo/personalInfo?groupMemberId=' + id
    });
  },
  goTaskDetail:function(event){
    let that=this;
    console.log(event.currentTarget.dataset);
    let taskId = event.currentTarget.dataset.taskid;
    let childId = event.currentTarget.dataset.childid;
    console.log('childId：'+childId);
    console.log('taskId：' + taskId);
    // 判断如果当前任务状态待确认并且被查询人物角色为家长且登录人与被查询人为同一人，怎可跳转到任务确认界面进行确认
    console.log(this.data.personId);
    console.log(app.globalData.groupMemberId);
    if (event.currentTarget.dataset.state == "02" && this.data.isParent == "true" &&this.data.personId == app.globalData.groupMemberId){
        // 跳转到可进行任务确认的页面
        wx.navigateTo({
          url: '../taskDetailOne/taskDetailOne?taskId='+ taskId,
        })
    } else if (event.currentTarget.dataset.state == "01" && this.data.isParent == "false" && this.data.personId == app.globalData.groupMemberId){
      // 调取任务查询接口，查看当前任务的状态
      UrlUtil.findJson(properties.getURL(), 'family/taskDetail/query', { "taskId": taskId }).then(d => {
        console.log(d);
        for (var i = 0; i < d.dataList.length;i++){
          if (d.dataList[i].chGroupMemberId == app.globalData.groupMemberId){
            if (d.dataList[i].taskState =="01"){
              // 跳转到可进行申请任务确认的页面
              wx.navigateTo({
                url: '../taskDetail/taskDetail?taskId=' + taskId,
              })
            }else{
              wx.navigateTo({
                url: '../taskList/taskList?groupMemberId=' + that.data.personId + '&isParent=' + that.data.isParent,
              })
            }
          }
        }
      });      
    }
  }
})