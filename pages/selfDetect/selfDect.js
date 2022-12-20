// pages/selfDetect/selfDect.js
const db = wx.cloud.database()
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/home.png?sign=ac5d28511e40e6f47a47eae4d19969e2&t=1650432147",
        doctorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%81%A5%E5%BA%B7.png?sign=b9f4e339c6677cf8186df1d46f5e54dc&t=1650432698",
        nameSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E7%94%A8%E6%88%B7.png?sign=002f3b6ad231322620384f332edc3478&t=1650432863",
        IDSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E8%BA%AB%E4%BB%BD%E8%AF%81%20(3).png?sign=2341eee9ecd6e365dd9e9b02585c6a2e&t=1650432895",
        telSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E7%94%B5%E8%AF%9D%20(3).png?sign=2267ea3b13842a46303ca57bcab6a4fd&t=1650432925",
        tiwenSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E6%B8%A9%E5%BA%A6.png?sign=ea8a31fcb4883029307fb8c1636e86f9&t=1650964467",
        placeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%9C%B0%E7%82%B9.png?sign=1e98e1e170db0cf40995bd53a00ed6e1&t=1650964669",
        selected: 2,//单选框
        items: [
            {value: '1', name: '没有出现症状', checked: 'true'},
            {value: '2', name: '感冒症状：乏力，咳嗽，发烧，肌肉疼，头疼'},
            {value: '3', name: '喘憋，呼吸急促'},
            {value: '4', name: '恶心呕吐，腹泻'},
            {value: '5', name: '心慌、胸闷'},
            {value: '6', name: '结膜炎(红眼病样表现：眼镜涩、红分泌物)'},
            {value: '7', name: '其他症状'},
          ],
          hasInfo:false,//标识数据库中有无用户信息
          username:'',
          userID:'',
          userTel:'',
          userTemperature:'',
          //用户选择地点
          mapName:'',
          result:'',//存储用户选择的健康情况,
          symptom:[],
          hasAddress:false,
          available:false

    },

    addTemperature(event){
        this.setData({
            userTemperature:event.detail.value,
        })
    },
    //定位功能-用户选择位置
    getSite(){
       let that = this
       wx.chooseLocation({
        success: function (res) {
            //赋值给data中的mapName
            that.setData({
                mapName: res.name,
                hasAddress:true
            })
        },
        //错误信息
        fail: function () {
            console.log("地址获取失败");
        }
    })
    
   },
   //多选功能
    checkboxChange(e) {
        var result=""
        this.setData({
            symptom:e.detail.value
        })
        const items = this.data.items
        const values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
          items[i].checked = false
          for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            if (items[i].value === values[j]) {
              items[i].checked = true
              result+=items[i].name+";"
              break
            }
          }
        }
       this.setData({
           result:result
       })
        
    },
    //设置单选value
    radioChange:function(e){
        var that = this;
        that.setData({
        selected:e.detail.value
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
                        username:res.data[0].name,
                        userID:res.data[0].ID,
                        userTel:res.data[0].Tel,
                    })
                    
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '您还未录入信息',
                        success (res) {
                          if (res.confirm) {
                            console.log('用户点击确定')
                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                      })
                }
                
            }
        })
    },
    save(){
      let dataTime
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth()+1
      let dd = new Date().getDate()
      dataTime = `${yy}-${mm}-${dd}`;
      //在添加之前要先查找该用户今日是否已添加
      db.collection('selfDetect').where({
          name:this.data.username,
          time:dataTime
      }).get({
          success:res=>{
              //如果查询今日已添加，则不可添加
              if(res.data!=""){
                  wx.showToast({
                      title: '今日已添加',
                      icon: 'error',
                      duration: 3000
                    })
              }else{
                  if(this.data.mapName=="" || this.data.userTemperature==""){
                    wx.showToast({
                      title: '请输入信息',
                      icon: 'error',
                      duration: 3000
                    })
                  }else{
                    //今日未添加
                      var flag = false
                      if(this.data.selected==1){
                          flag = true
                      }
                      var temp=""//存储症状
                      if(this.data.symptom==""){
                          temp="无症状"
                          this.setData({
                            available:true
                          })
                      }else{
                        //同时选择无症状和有症状--提示出错
                          if(this.data.symptom.length>1 && this.data.items[0].checked){
                              wx.showToast({
                                  title: '请输入正确信息',
                                  icon: 'error',
                                  duration: 3000
                              })
                          }else if(this.data.symptom.length==1 && this.data.symptom[0]==1){
                          //只选择了无症状
                              temp = "无症状"
                              this.setData({
                                available:true
                              }) 
                          }else if(this.data.symptom.length>=1){
                              temp = this.data.result
                              this.setData({
                                available:true
                              }) 
                          }
                      }
                      if(this.data.available){
                        db.collection('selfDetect').add({
                            data:{
                                  nickName:app.globalData.userInfo.nickName,
                                  name:this.data.username,
                                  ID:this.data.userID,
                                  tel:this.data.userTel,
                                  place:this.data.mapName,
                                  temperature:this.data.userTemperature,
                                  symptom:temp,
                                  time:dataTime,
                                  touch:flag
                            },
                            success:res=>{
                                  wx.showToast({
                                      title: '添加成功',
                                      icon: 'success',
                                      duration: 3000
                                    })
                            },
                            fail(res){
                                  
                            }
                        })
                      }
                  }
              }
          }
      })
  },
    toHome(){
        wx.navigateBack({
            delta: 1
        })
    },
})
