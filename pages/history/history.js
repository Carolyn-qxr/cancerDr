// pages/history/history.js
var app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/home.png?sign=ac5d28511e40e6f47a47eae4d19969e2&t=1650432147",
        doctorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%81%A5%E5%BA%B7.png?sign=b9f4e339c6677cf8186df1d46f5e54dc&t=1650432698",
        array: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //查找当前用户的历史检测信息
        // app.globalData.userInfo.nickName
        db.collection('history').where({
            nickName:'朝颜'
        }).get({
            success:res=>{
                this.setData({
                    array:res.data
                })
                console.log(this.data.array)
            }
        })
    },
    toHome(){
        wx.navigateBack({
            delta: 1
        })
    },

    
})
