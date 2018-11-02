//index.js
//获取应用实例
const $global = getApp().globalData
Page({
  data: {
    slogan: '你的安全，我们用心随行',
    logo: '/static/img/logo.png'
  },
  onLoad () {
    setTimeout(() => {
      wx.request({
        url: getApp().globalData.api + '/is_using',
        data: { openid: $global.openId },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res2) {
          console.log(res2)
          if (res2.data.code === 1) {
            if (res2.data.is_using === 1) {
              wx.redirectTo({
                url: '/pages/going/going?id=' + res2.data.tid,
              })
            } else {
              wx.redirectTo({
                url: 'pages/togo/togo',
              })
            }
          } else {
            wx.showToast({
              title: '网络错误',
            })
          }
        },
      })
    }, 2100)
  }
})
