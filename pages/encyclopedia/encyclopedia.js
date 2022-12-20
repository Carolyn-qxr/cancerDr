// pages/encyclopedia/encyclopedia.js
var app = getApp()
const db = wx.cloud.database()
let result=''
Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/home.png?sign=ac5d28511e40e6f47a47eae4d19969e2&t=1650432147",
        doctorSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%81%A5%E5%BA%B7.png?sign=b9f4e339c6677cf8186df1d46f5e54dc&t=1650432698",
        cancerSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/cancer.jpg?sign=9baa751bd614d928d66df1e775bff62e&t=1650784454",
        citeSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E5%BC%95%E7%94%A8.png?sign=b938be3c52fa7307134b64af9076b492&t=1650879644",
        xialaSrc:"https://6361-cancer-dr-4g6jr373fb3798e0-1310829361.tcb.qcloud.la/%E4%B8%8B%E6%8B%89.png?sign=ed188ab178a8b73a15d445a50dd88c21&t=1653560683",

          //存储查询数据
          cancer_name:'',
          definition:'',
          manifestation:'',
          pathogenesis:'',
          cancer_img:'',
          //-------------------
          currentTab:0,
          currentClick:0,
          currentIndex: 0, //默认是活动项
          show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
          selectData:['结肠腺癌','肺腺癌','肺鳞状细胞癌'],//下拉列表的数据
          index:0//选择的下拉列表下标
    },
    pagechange: function (e) {
      // 通过touch判断，改变tab的下标值
      if ("touch" === e.detail.source) {
        let currentPageIndex = this.data.currentIndex;
        currentPageIndex = (currentPageIndex + 1) % 2;
        // 拿到当前索引并动态改变
        this.setData({
          currentIndex: currentPageIndex,
        })
      }
    },
    //点击tab时触发
    titleClick: function (e) {
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
    },
    //返回主界面
    toHome(){
      wx.navigateBack({
          delta: 1
      })
    },
    //数据库查找方法
    search(){
        let that  = this
        db.collection('cancer_list').where({
            name:this.data.cancer_name
        }).get({
            success:function(res){
                that.setData({
                    cancer_name:res.data[0].name,
                    definition:res.data[0].definition,
                    manifestation:res.data[0].manifestation,
                    pathogenesis:res.data[0].pathogenesis,
                    cancer_img:res.data[0].img
                })
            }
        })
       
       
    },
    // 点击下拉显示框
  selectTap(){
    this.setData({
      show: !this.data.show
    });
  },
    // 点击下拉列表
    optionTap(e){
        let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
        this.setData({
        index:Index,
        show:!this.data.show,
        cancer_name:this.data.selectData[Index]
        });
        this.search()
    },

    //切换Tab
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
          return false;
        } else {
          that.setData({
            currentTab: e.target.dataset.current,
          })
        }
    },
    onLoad(options) {
        this.setData({
            cancer_name:this.data.selectData[this.data.index]
        })
        this.search()
    },
})
