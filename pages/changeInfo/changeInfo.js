// pages/changeInfo.js
const db = wx.cloud.database()
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E8%BF%94%E5%9B%9E%20(1).png?sign=7e1c112ee67881fb50cf684556dda5c8&t=1651829163",
        doctorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%81%A5%E5%BA%B7.png?sign=b9f4e339c6677cf8186df1d46f5e54dc&t=1650432698",
        editUrl:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E7%BC%96%E8%BE%91%20(1).png?sign=856351369ed0116c7507bffad7bfa895&t=1653527641",
        array: ['男', '女'],
        region: '请输入省市区',
        customItem: '全部',
        name:'祁晓蓉',//标识用户姓名
        ID:'620121200012133620',//标识用户身份证号码
        city:'请选择',//标识用户城市
        tel:'13121030232',//标识用户手机号
        gender:'请选择',
        hasInfo:false,
        hasTel:false,
        inputName:'',
        inputID:'',
        inputTel:'',
        _id:'',
        cityChanged:false,
        telChanged:false,
        changed:false

        
    },
    //返回上层页面，delta是返回的页面数
    before(){
        wx.redirectTo({
            url: '/pages/userInfo/userInfo'
        })
    },
    //绑定数据
    addName(event){
        this.setData({
            inputName:event.detail.value,
        })
    },
    addID(event){
        this.setData({
            inputID:event.detail.value,
        })
    },
    addTel(event){
        this.setData({
            inputTel:event.detail.value,
        })
        this.setData({
            telChanged:true
        })
    },
    //性别选择
    bindPickerChange: function(e) {
        this.setData({
          gender:this.data.array[e.detail.value]
        })
    },
    //地区选择器
    bindRegionChange: function (e) {
        var text = e.detail.value[0]+""+e.detail.value[1]+""+e.detail.value[2]
        this.setData({
          city:text
        })
        this.setData({
            cityChanged:true
        })
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.search()
    },
    search(){
        db.collection('userInfo').where({
            nickName:app.globalData.userInfo.nickName
        }).get({
            success:res=>{
                if(res.data!=""){
                    this.setData({
                        hasInfo:true,
                        hasTel:true
                    })
                    this.setData({
                        name:res.data[0].name,
                        ID:res.data[0].ID,
                        gender:res.data[0].gender,
                        city:res.data[0].city,
                        tel:res.data[0].Tel
                    })
                }else{
                    
                }
                
            }
        })
    },
    //点击修改电话号码
    edit(){
        console.log("已点击")
        this.setData({
            hasTel:false
        })
    },
    //用户修改信息
    save(){
        // 首先判断数据库中有无该用户，若无，则添加一条记录，若有，则更新用户修改的内容
        db.collection('userInfo').where({
            nickName:app.globalData.userInfo.nickName
        }).get({
            success:res=>{
                //数据库不存在该用户
                if(res.data==""){
                    if(this.data.inputID.length!=18 || this.data.inputTel.length!=11
                        || this.data.inputName=="" || this.data.gender=="请选择" || this.data.city=="请选择"){
                        wx.showToast({
                            title: '请输入正确信息格式',
                            icon: 'error',
                            duration: 3000
                          })
                    }else{
                        db.collection('userInfo').add({
                            data:{
                                nickName:app.globalData.userInfo.nickName,
                                name:this.data.inputName,
                                ID:this.data.inputID,
                                gender:this.data.gender,
                                city:this.data.city,
                                Tel:this.data.inputTel
                            },
                            success:res=>{
                                wx.showToast({
                                    title: '添加成功',
                                    icon: 'success',
                                    duration: 3000
                                  })
                                this.search();
                            },
                            fail(res){
                                
                            }
                        })
                    }
                    
                }else{
                    //用户信息已存在则修改用户信息
                    this.setData({
                        _id:res.data[0]._id
                    })

                  //用户未修改信息
                   if(this.data.cityChanged==false && this.data.telChanged==false){
                        wx.showModal({
                            title: '提示',
                            content: '您还未修改信息',
                        })
                   }
                   else{
                    //用户修改城市
                    if(this.data.cityChanged){
                        db.collection('userInfo').doc(this.data._id)
                        .update({
                            data: {
                                city:this.data.city,
                            }
                        })
                        .then(res=>{
                            wx.showToast({
                                title: '信息修改成功',
                                icon: 'success',
                                duration: 3000
                              })
                           this.setData({
                               changed:true
                           })
                        })
                    }
                    //用户修改手机号
                    if(this.data.telChanged){
                        if(this.data.inputTel.length==11){
                            db.collection('userInfo').doc(this.data._id)
                            .update({
                                data: {
                                    Tel:this.data.inputTel
                                }
                            })
                            .then(res=>{
                                wx.showToast({
                                    title: '信息修改成功',
                                    icon: 'success',
                                    duration: 3000
                                  })
                               this.setData({
                                changed:true
                            })
                            })
                        }else{
                            wx.showToast({
                                title: '手机号格式错误',
                                icon: 'error',
                                duration: 3000
                              })
                        }
                    }
                   if(this.data.changed){
                      this.search()
                   }
                   }
                }    
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

   
})
