//properties.js 公用配置文件，每一个参数需要对应对外暴露get函数，外部才能获取

//服务器地址
// const URL = 'http://localhost:3000'
//const URL = 'http://172.20.10.6:8056/WechatRedPacket'
// const URL = 'https://www.qingfanyun.cn/WechatRedPacket'
const URL = 'https://www.qingfanyun.cn/WxRedPacketCompress'
// const URL2 = 'https://www.qingfanyun.cn/WechatRest'
	
//const URL = 'http://localhost:8080/WechatRest'
//const URL2 = 'http://localhost:8080/WechatRest'

//-----------------对外输出-------------------------------//
module.exports = {
    getURL()  { return URL},
    getURL2() { return URL2},
}