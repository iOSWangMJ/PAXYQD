// pages/index/index.js
const UrlUtil = require('../../libraries/serverUrlUtil.js')
const properties = require('../../libraries/properties.js')
let app = getApp();
Page({
  data: {
    isrefresh:false,
    isNav:false,
    count: 0,
    itemsLoading: false,
    // firstLanuch:true,
    //查询行
    startIndex: 0,
    //查询页数
    numPerPage: 10,
    tag: '',
    showModalStatus: false,
    authIsDisabled: true,
    userId: '',
    familyId: '',
    groupMemberId: '',
    authParam: {
      groupMemberId: ''
    },
    imgUrl: 'http://paicwx.oss-cn-shanghai.aliyuncs.com',
    authWidth: 0,
    roleType: '',
    auth: [],
    dataList: [],
    end: 0,
    haveMore: true,
    bannerImg: [
      {
        banner: 'banner_chanpin@2x.png',
        index: "chanpinjieshao.png"
      },
      {
        banner: 'banner_hongbao@2x.png',
        index: "hongbaoshuoming.png"
      },
      {
        banner: 'banner_renwu@2x.png',
        index: "renwushuoming.png"
      }
    ],
    nailUrl: '../../images/xuanguaxiaoqiu.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.clearStorageSync();
    let that = this;
    //查询动态
    let authResult = wx.getStorageSync('auth');
    if (authResult) {
      that.authStyle(authResult);
    }
    let authParam = {
      groupMemberId: app.globalData.groupMemberId
    }
    this.setData({
      userId: app.globalData.userId,
      familyId: app.globalData.familyId,
      groupMemberId: app.globalData.groupMemberId,
      authParam: authParam
    })
    UrlUtil.findJson(properties.getURL(), 'family/active/query', { "startIndex": this.data.startIndex, "numPerPage": this.data.numPerPage, "userId": this.data.userId, "groupMemberId": this.data.groupMemberId, "familyId": this.data.familyId })
      .then(d => {
        if (d.respCode === "0000") {
          console.log(d);
          if (!authResult) {
            //权限按钮
            that.authStyle(d.auth);
            wx.setStorageSync('auth', d.auth);
          }
          let startIndex = that.data.startIndex;
          startIndex += that.data.numPerPage;
          let haveMore = true;
          //if (d.count <= that.data.startIndex) {
          if (d.count <= startIndex) {  
            haveMore = false;
          }
          that.setData({
            roleType: d.roleType,
            dataList: d.dataList,
            haveMore: haveMore,
            count: d.count,
            startIndex: startIndex
          })

        }
      })
      .catch(d => {
        that.setData({
          haveMore: false
        })
      })
    //判断是否有账本
    UrlUtil.findJson(properties.getURL(), 'family/familyMember/query', { "userId": this.data.userId, "groupMemberId": this.data.groupMemberId, "familyId": this.data.familyId })
      .then(d => {
        if (d.respCode === "0000") {
          let hasParent = false;
          let hasChild = false;
          d.dataList.forEach((val) => {
            if (val.roleType === "00") {
              if (!hasParent) {
                hasParent = true;
              }
            }
            if (val.roleType === "01") {
              if (!hasChild) {
                hasChild = true;
              }
            }
          })
          //当有家长和宝宝时 权限按钮可以点击
          if (hasParent && hasChild) {
            that.setData({
              authIsDisabled: false
            })
          }
        }
      })
  },
  // 权限样式设置
  authStyle: function (param) {
    let auth = [];
    param.forEach((val) => {
      if (val === "0001" || val === "0002" || val === "0003" || val === "0104" || val === "0101" || val === "0102" || val === "0301") {
        auth.push('auth' + val);
      }
    })
    let authWidth = 100 / auth.length;
    this.setData({
      auth: auth,
      authWidth: authWidth,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(!this.data.isrefresh){
      let that = this;
      this.setData({
        startIndex: 0,
        isrefresh:true
      })
      UrlUtil.findJson(properties.getURL(), 'family/active/query', { "startIndex": this.data.startIndex, "numPerPage": this.data.numPerPage, "userId": this.data.userId, "groupMemberId": this.data.groupMemberId, "familyId": this.data.familyId })
        .then(d => {
          if (d.respCode === "0000") {
            
            let startIndex = that.data.startIndex;
            startIndex += that.data.numPerPage;
            let haveMore = true;
            if (d.count <= startIndex) {
              haveMore = false;
            }
            that.setData({
              startIndex: startIndex,
              dataList: d.dataList,
              haveMore: haveMore,
              count: d.count,
              isrefresh: false
            })
            wx.stopPullDownRefresh();
          }
        })

      if (this.data.authIsDisabled){
          UrlUtil.findJson(properties.getURL(), 'family/familyMember/query', { "userId": this.data.userId, "groupMemberId": this.data.groupMemberId, "familyId": this.data.familyId })
            .then(d => {
              if (d.respCode === "0000") {
                let hasParent = false;
                let hasChild = false;
                d.dataList.forEach((val) => {
                  if (val.roleType === "00") {
                    if (!hasParent) {
                      hasParent = true;
                    }
                  }
                  if (val.roleType === "01") {
                    if (!hasChild) {
                      hasChild = true;
                    }
                  }
                })
                //当有家长和宝宝时 权限按钮可以点击
                if (hasParent && hasChild) {
                  that.setData({
                    authIsDisabled: false
                  })
                }
              }
            })
        }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (!this.data.itemsLoading && this.data.count > this.data.startIndex) {
      this.setData({
        itemsLoading: true
      })
      UrlUtil.findJson(properties.getURL(), 'family/active/query', { "startIndex": this.data.startIndex, "numPerPage": this.data.numPerPage, "userId": this.data.userId, "groupMemberId": this.data.groupMemberId, "familyId": this.data.familyId })
        .then(d => {
          if (d.respCode === "0000") {
            let startIndex = that.data.startIndex;
            startIndex += that.data.numPerPage;
            let haveMore = true;
            if (d.count <= startIndex) {
              haveMore = false;
            }
            let dataList = that.data.dataList;
            dataList = dataList.concat(d.dataList);
            that.setData({
              dataList: dataList,
              haveMore: haveMore,
              startIndex: startIndex,
              itemsLoading: false
            })
            wx.stopPullDownRefresh();
          }
        })
    }

  },
  //点击动态区域
  handleClickDynamicArea(event) {

    let that = this;  
    if (!this.data.isNav&&event.currentTarget.dataset.type === "0102" && this.data.roleType === "00" && this.data.groupMemberId === event.currentTarget.dataset.parentgroupmemberid && event.currentTarget.dataset.taskstate === "02") {
      that.setData({
        isNav: true
      })
        wx.navigateTo({
          // 申请完成
          url: '../taskDetailOne/taskDetailOne?taskId=' + event.currentTarget.dataset.taskid,
          complete:function(){
            console.log('跳转完成');
            that.setData({
              isNav: false
            })
          }
        })
        
      }
    if (!this.data.isNav &&event.currentTarget.dataset.type === "0101" && this.data.roleType === "01" && this.data.groupMemberId === event.currentTarget.dataset.chgroupmemberid && event.currentTarget.dataset.taskstate === "01") {
        that.setData({
          isNav: true
        })
        wx.navigateTo({
          // 任务详情
          url: '../taskDetail/taskDetail?taskId=' + event.currentTarget.dataset.taskid + "&&parentAvatarUrl=" + event.currentTarget.dataset.avatarUrl,
          complete:function(){
            that.setData({
              isNav: false
            })
          }
        })
        
      }
  },
  handleClickAward(event) {
        if (!this.data.isNav&&this.data.roleType === "00") {
          console.log('正在调用')
          let that = this;
          this.setData({
            isNav:true
          })
          wx.navigateTo({
            // 奖励红包
            url: '../giveHongBao/giveHongBao?chGroupMemberId=' + event.currentTarget.dataset.chmemberid + '&&dynId=' + event.currentTarget.dataset.dynid + '&&avatarUrl=' + event.currentTarget.dataset.avatarurl + '&&roleTag=' + event.currentTarget.dataset.roletag,
            complete:function(){
              that.setData({
                isNav:false
              })
            }
          })
        }  
  },
  //点击头像图片
  handleClickIcon(event) {
    if (event.currentTarget.dataset.type === "0104") {
      wx.redirectTo({
        // 点击头像
        url: '../personalInfo/personalInfo?groupMemberId=' + event.currentTarget.dataset.chgroupmemberid,
      })
    } else {
      wx.redirectTo({
        // 点击头像
        url: '../personalInfo/personalInfo?groupMemberId=' + event.currentTarget.dataset.groupmemberid,
      })
    }
  },
  //点击浏览图片
  handleBrowsePic(event) {
    let images = [];
    event.currentTarget.dataset.images.forEach((val) => {
      images.push(val.oriImage);
    })
    wx.previewImage({
      current: images[event.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },
  //权限是否可以点击
  handleClickAuth(event) {

      
      if (!this.data.authIsDisabled&&!this.data.isNav) {
        this.setData({
          isNav:true
        })
        let that = this;
        wx.navigateTo({
          url: event.currentTarget.dataset.url,
          complete:function(){
            that.setData({
              isNav:false
            })
          }
        })
        
      } else {
        let tag = '';
        if (this.data.roleType === "00") {
          tag = '宝宝';
        } else {
          tag = "家长";
        }
        this.setData({
          tag
        })
        var currentStatu = event.currentTarget.dataset.statu;
        this.util(currentStatu)
      }

  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
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