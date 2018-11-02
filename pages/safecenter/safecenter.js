const $global = getApp().globalData
Page({
  data: {
    times: ''
  },
  onLoad: function (options) {
    const that = this
    let info = {}
    console.log($global)
    info.avatar = $global.userInfo.avatarUrl
    info.name = $global.userInfo.nickName
    wx.request({
      url: $global.api + '/travel_length',
      data: {openid: $global.openId},
      method: 'GET',
      success: function(res) {
        if (res.data.code === 1) {
          wx.request({
            url: $global.api + '/user_phone',
            data: { openid: $global.openId },
            method: 'GET',
            success: function (res1) {
              if (res1.data.code === 1) {
                info.times = res.data.travel_length
                info.phone = res1.data.phone
                that.setData({ info })
              } else {
                wx.showToast({
                  title: '网络错误',
                  image: '/static/img/filed.png'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '网络错误',
            image: '/static/img/filed.png'
          })
        }
      },
    })

  }
})