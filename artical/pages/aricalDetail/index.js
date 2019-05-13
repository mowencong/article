const util = require('../../utils/util.js')
const proRequest = util.wxPromisify(wx.request)
Page({
  data: {
    id: '8545',
    details: {},
    content: [],
    obj: {},
    timeTitle: '',
    creatTime:'',
    aricalList:[]
  },
  onLoad: function (options) {
    console.log('mwc',options)
    //获取路由传过来的参数
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    if(options.item){
      this.setData({
        item:options.item
      })
      console.log('推荐文章',this.list)
    }
    this.getDetail()
    this.getList(0)
  },
  //推荐列表
  getList(pageNo) {
    var that = this;    //个人习惯，为避免this指向出错，函数前必加
    util.racePromise(proRequest({
      url: util.URL + 'test/get.php',  //请求地址
      method: 'get',
      data: {
        type: 'GetAll',
        page: pageNo + 1,
        count: 5
      },    //函数方法
    })).then(res => {    //！！！注意括号的个数！！！
      console.log(123, res.data)
      let arrays=res.data.map(item=>{
        var sjc = item.time * 1
        console.log('时间戳', sjc)
        var mwc = new Date(sjc);
        var y = mwc.getFullYear();
        var m = mwc.getMonth() + 1;
        var d = mwc.getDate();
        var h = mwc.getHours();
        var mm = mwc.getMinutes();
        var s = mwc.getSeconds();
        var days = y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
        item.time=days
        return item;
      })
      this.setData({
        page: pageNo + 1,//当前页号
        aricalList: arrays,
      })
      console.log('数据列表',this.data.aricalList)
    }).catch(res => {    //若是请求超时，则catch进行捕获，弹窗提示网络错误。可写可不写
      //util.showError() 
    })
  },
  //详情
  getDetail() {
    var that = this;    //个人习惯，为避免this指向出错，函数前必加
    console.log(that.data.id)
    util.racePromise(proRequest({
      url: util.URL + 'test/get.php',  //请求地址
      method: 'get',
      data: {
        type: 'GetGraphic',
        id: that.data.id
      },    //函数方法
    })).then(res => {    //！！！注意括号的个数！！！
      console.log(JSON.parse(res.data.content))
      //let timers = this.getLocalTime(res.data.time)
      var timestamp = Date.parse(new Date());
      if (res.data.time) {
        var timer = timestamp - res.data.time
        console.log(timer)
        if (timer < 5 * 60 * 1000) {
          this.setData({
            timeTitle: '刚刚'
          })
        } else if (timer >= 5 * 60 * 1000 && timer < 3600 * 1000) {
          var mineter = parseInt(timer / 60000)
          this.setData({
            timeTitle: mineter + '分钟'
          })
        } else if (timer >= 3600 * 1000 && timer < 24 * 3600 * 1000) {
          var hours = parseInt(timer / (24 * 3600 * 1000))
          this.setData({
            timeTitle: hours + '小时'
          })
        } else {
          var sjc = res.data.time * 1
          console.log('时间戳', sjc)
          var mwc = new Date(sjc);
          var y = mwc.getFullYear();
          var m = mwc.getMonth() + 1;
          var d = mwc.getDate();
          var h = mwc.getHours();
          var mm = mwc.getMinutes();
          var s = mwc.getSeconds();
          var days = y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
          this.setData({
            timeTitle: days
          })
        }
      }
      console.log('时间', this.data.timeTitle)
      if (res.data.content) {
        let array = []
        let arr = JSON.parse(res.data.content) || []
        for (let i = 0; i < arr.length; i++) {
          if (i % 2 == 1) {
            this.setData({
              obj: {
                url: arr[i - 1].url,
                text: arr[i].text
              }
            })
            array.push(this.data.obj)
          }
        }
        this.setData({
          content: array,
          details: res.data
        })
        console.log('数据处理', array)
      }
    }).catch(res => {    //若是请求超时，则catch进行捕获，弹窗提示网络错误。可写可不写
      //util.showError() 
    })
  },
  //补零操作
  add0(m) { return m < 10 ? '0' + m : m },
  // 跳转到首页
  gohome(){
    wx.navigateTo({
      url: "/pages/aricalList/index"
    })
  },
  // 文章分享
  share(){
    wx.updateShareMenu({
      withShareTicket:true,
      success(){}
    })
    wx.showShareMenu({
      
    })
  }
})