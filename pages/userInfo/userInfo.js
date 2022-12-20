// pages/userInfo/userInfo.js
var app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/home.png?sign=ac5d28511e40e6f47a47eae4d19969e2&t=1650432147",
        doctorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%81%A5%E5%BA%B7.png?sign=b9f4e339c6677cf8186df1d46f5e54dc&t=1650432698",
        femaleUrl:'https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E6%80%A7%E5%88%AB%E5%A5%B3.png?sign=f5851f27cb2b79bbb80fe9a262081e08&t=1651126273',
        maleUrl:'https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E6%80%A7%E5%88%AB%E7%94%B7.png?sign=526333f10a910e3edb2cfb198b70498a&t=1651126327',
        rightUrl: 'https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%90%91%E5%8F%B3.png?sign=753dd83c4d1121ac0716843d63c09e54&t=1651126352',
        userID:'',
        avatar:"https://thirdwx.qlogo.cn/mmopen/vi_32/K3GyAMl0x0ibR1VVbLH84pcsJyLSicPKxcLfmdJTm99ZYUr7sicVjiallgGHxXSZWTA2W3v50RugcER9WNLxdHkwhA/132",
        userTel:'',
        nickName:'朝颜',
        username:'',
        userCity:'',
        gender:0,//0男1女

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       this.setData({
            nickName:app.globalData.userInfo.nickName,
            avatar:app.globalData.userInfo.avatarUrl,
       })
       db.collection('userInfo').where({
            nickName:app.globalData.userInfo.nickName
       }).get({
           success:res=>{
               if(res.data!=""){
                    this.setData({
                        username:res.data[0].name,
                        userID:res.data[0].ID,
                        userTel:res.data[0].Tel,
                        userCity:res.data[0].city
                    })
                    if(res.data[0].gender=="男"){
                        this.setData({
                            gender:0,
                        })
                    }else{
                        this.setData({
                            gender:1,
                        })
                    }
               }else{
                this.setData({
                    username:'微信用户',
                    userID:'无',
                    userTel:'无',
                    userCity:'无'
                })
                wx.showModal({
                    title: '提示',
                    content: '您还未录入信息,前往录入信息',
                    success (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/changeInfo/changeInfo',
                              })
                        } else if (res.cancel) {

                        }
                        
                    }
                  })
               }
           }
       })
    },
    //退出登录
    loginOut(){
        app.globalData.loginStatus = false
        this.setData({
            nickName:'',
            avatar:'',
            username:'',
            userID:'',
            userTel:'',
            userCity:''
        })
        wx.navigateTo({
            url: '/pages/list/list',
        })
        wx.showToast({
            title: '您已退出登录',
            icon: 'success',
            duration: 3000
        })
    },

    toChange:function(){
        wx.navigateTo({
            url: '/pages/changeInfo/changeInfo',
          })
    },
    toHome(){
        wx.navigateBack({
            delta: 2
        })
    },
    
})

