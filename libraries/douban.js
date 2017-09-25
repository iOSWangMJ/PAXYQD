//serverUrlUtil.js  用于和后端服务器交互的公用处理模块

const API_URL = 'https://www.qingfanyun.cn/WechatRest'  //用于不带URL的公用函数
//const API_URL = 'http://localhost:8080/WechatRest'  //用于不带URL的公用函数
const Promise = require('./bluebird')

//不带URL（不通过传参）调用服务器公用函数
function fetchApi (type, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      method:'post',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: resolve,
      fail: reject 
    })  
  })
} 

//带带URL(通过传参)调用服务器公用函数
function fetchApiUrl (type, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}/${type}`,
      method:'post',
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  //查多条记录
  find (type, page = 1, count = 20, condition = {}) {
    const params = { currentPage: page, pageSize: count }
    return fetchApi(type, condition ? Object.assign(params, condition) : params) 
      .then(res => res.data)
  }, 
  //查一条记录
  findOne (id) {
    return fetchApi('subject/' + id)
      .then(res => res.data)
  },
   //公用查多条记录
  findList (URL,type,parm,pages){
    pages = { start: parm.page1  * parm.count, count: parm.size1}
    return fetchApiUrl(URL,type, pages)
      .then(res => res.data)
  },
  //公用查一条记录
  findSingle (type,params) {
    return fetchApiUrl(type , params)
      .then(res => res.data)
  }
}
