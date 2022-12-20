// app.js

App({
    globalData:{
        result:"",//存储癌症检测结果
        imageUrl:"",//存储癌症检测图片
        userName:'',//检测人
        userID:'',//检测人身份证号
        userTel:'',//检测人手机号
        userInfo:{},
        loginStatus:false

        
    },
   onLaunch() {
    //云开发环境初始化
    wx.cloud.init({
      env:"cancer-dr-4g6jr373fb3798e0",
    })
    wx.request({
        url: '192.168.0.104',
      })
  } ,
 
})
