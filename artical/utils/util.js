// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// // module.exports = {
// //   formatTime: formatTime
// // }


// /**
//  * wxPromisify 使用promise封装request请求
//  * @fn 传入的函数，如wx.request、wx.download
//  */
//时间戳换算年月日时分秒
var formatTime = function (number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {  //网络通畅，请求发送成功
        console.log(res)
        if (res.statusCode == 200) {  //判断后台返回的状态码，若是成功，返回resolve()
          return resolve(res)
        } else {     //若是返回错误的状态码，弹窗提示失败信息，并附带错误代码，以便快速定位问题所在
          wx.showModal({
            title: '网络请求错误',
            content: res.data,
            showCancel: false,
          })
        }
      }
      obj.fail = function (res) {    //网络阻塞，请求发送失败，显示错误提示
        showError()       //此函数在下面定义，用于打印错误信息
        return reject(res)
      }
      fn(obj) //执行函数，obj为传入函数的参数
    })
  }
}
/**
 * 加载超时后显示网络错误提示
 * 当前设置为等待2.5秒，若超时后仍未返回请求结果，弹窗提示网络错误
 * @param 传入一个Promise对象
 */
function racePromise(proRequest) {
  return Promise.race([
    proRequest,
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(), 2500)
    })
  ])
}
/**
 * 弹窗提示网络错误
 */
function showError() {
  wx.showModal({
    title: '加载失败',
    content: '请检查网络连接',
    showCancel: false,
  })
}
module.exports = {
  URL: "https://im.meiriv.com/",   //具体的请求地址头
  wxPromisify: wxPromisify,
  racePromise: racePromise,
  showError: showError,
  formatTime: formatTime
}
