// pages/sign/sign.js
const $global = getApp().globalData
Page({
  data: {
    seconds: '获取验证码',
  },
  onLoad: function (options) {},
  handleVerify () {
    const that = this
    this.setData({errInfo: ''})
    if (!($global.reg.phone.test(that.data.phone))) {
      that.setData({errInfo: '请输入正确的手机号'})
    } else {
      wx.request({
        url: $global.api + '/verify',
        data: { phone_number: that.data.phone, openid: $global.openId },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'GET',
        success: function (res) {
          if (res.data.code === 1) {
            let seconds = 120
            that.setData({ seconds: seconds + 's' })
            setInterval(() => {
              if (seconds !== 0) {
                seconds--
                that.setData({ seconds: seconds + 's' })
              } else {
                that.setData({seconds: '获取验证码'})
              }
            }, 1000)
          }
        }
      })
    }

  },
  // 获取输入值
  handleInput (e) {
    const that = this
    let index = Number(e.currentTarget.dataset.index)
    if (index === 0) {
      that.setData({phone: e.detail.value})
    } else if (index === 1) {
      that.setData({ v_code: e.detail.value})
    }
  },
  // 提交注册
  handleSign () {
    const that = this
    that.setData({errInfo: ''})
    let v_code = that.data.v_code
    if (!v_code || v_code === '') {
      that.setData({errInfo: '请输入验证码'})
    } else {
      console.log($global)
      wx.request({
        url: $global.api + '/sign',
        data: { openid: $global.openId, phone: that.data.phone, v_code: that.data.v_code, ...$global.userInfo},
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function(res) {
          if(res.data.code === 1) {
            console.log(res)
          } else {
            that.setData({errInfo: res.data.errMsg})
          }
        }
      })
    }
  }
})