const util = require('../../utils/util.js')
const proRequest = util.wxPromisify(wx.request)
Page({
  data: {
    aricalList:[],
    autoplay:true,
    interval: 2000,
    duration:500,
    indicatorDots:true,
    page:1,
    pages:0
  },

  onLoad: function (options) {
    this.getList(0)
  },
  // 上拉加载
  onReachBottom(){
    //显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    this.getList(this.data.page)
  },
  getList(pageNo) {
    this.loading = true
    var that = this;    //个人习惯，为避免this指向出错，函数前必加
    util.racePromise(proRequest({
      url: util.URL + 'test/get.php',  //请求地址
      method: 'get',
      data: {
        type: 'GetAll',
        page: pageNo+1,
        count: 5
      },    //函数方法
    })).then(res => {    //！！！注意括号的个数！！！
      console.log(123, res.data)
      this.setData({
        page:pageNo+1,//当前页号
        aricalList:this.data.aricalList.concat(res.data),
      })
      setTimeout(function(){
        wx.hideLoading()
      },1000)
    }).catch(res => {    //若是请求超时，则catch进行捕获，弹窗提示网络错误。可写可不写
      //util.showError() 
      wx.hideLoading();
    })
  },
  // 跳转到文章页
  goDetails(e){
    let query = e.currentTarget.dataset['id'];
    //let list = e.currentTarget.dataset['item']
    wx.navigateTo({
      url: "/pages/aricalDetail/index?id="+query
    })
  }
})