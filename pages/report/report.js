// pages/report.js
var app = getApp()
const db = wx.cloud.database()
const cancer_list = db.collection('cancer_list')
let result=""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: '111',
        index:-1,
        username: '',
        userID:'',
        userTel:'',
        imgUrl:'',
        doctorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%81%A5%E5%BA%B7.png?sign=b9f4e339c6677cf8186df1d46f5e54dc&t=1650432698",
        backSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E8%BF%94%E5%9B%9E%20(1).png?sign=770dc1f5df66064a8f23485a40f28ede&t=1650434880",
        authorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E7%BC%96%E8%BE%91.png?sign=7a1493a72b7d8921d508fe647061f7fc&t=1650376376",
    },

    before(){
        wx.navigateBack({
        delta: 1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            result:app.globalData.result
        })
        this.setData({
            username:app.globalData.userName
        })
        this.setData({
            userID:app.globalData.userID   
        })
        this.setData({
            userTel: app.globalData.userTel
        })
        this.setData({
            imgUrl:app.globalData.imageUrl
        })
        let dataTime
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth()+1
        let dd = new Date().getDate()
        dataTime = `${yy}-${mm}-${dd}`;
        console.log(dataTime)
        //加入该条信息到数据库
        db.collection('history').add({
            data:{
                name:this.data.username,
                ID:this.data.userID,
                tel:this.data.userTel,
                img:this.data.imgUrl,
                result:this.data.result,
                dataTime:dataTime,
                nickName:app.globalData.userInfo.nickName
            },
            success:res=>{
            }
        
        })
    },
    
})
