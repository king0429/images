//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        wx.request({
          url: this.globalData.api + '/get_appid',
          data: {code: res.code},
          header: { "Content-Type": "application/x-www-form-urlencoded"},
          method: 'POST',
          success: function(res1) {
            console.log(res1)
            if (res1.data.code === 1) {
              getApp().globalData.openId = res1.data.openid
              if (res1.data.isNew === 1) {
                wx.redirectTo({
                  url: '/pages/sign/sign',
                })
              }
            } else {
              wx.showToast({
                title: res1.data.errMsg,
              })
            }
          },
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log(res)
          wx.getUserInfo({
            success: res1 => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res1.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
        }
      }
    })
  },
  globalData: {
    recordRoot: 'http://127.0.0.1:3000/record/',
    api: 'http://127.0.0.1:3000/safe',
    reg: {
      phone: /^1[34578]\d{9}$/
    }
  }
})