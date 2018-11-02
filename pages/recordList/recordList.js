const $global = getApp().globalData
Page({
  data: {
    // 录音列表
    list: [],
    root: $global.recordRoot,
    // mock: ''
    controls: [
      { name: '播放', icon: 'iconfont icon-bofang1' },
      { name: '暂停', icon: 'iconfont icon-zanting' },
      { name: '播放', icon: 'iconfont icon-ai08' }
    ]
  },
  onLoad: function (options) {
    const that = this
    wx.request({
      url: $global.api + '/record',
      method: 'GET',
      data: {openid: $global.openId, page: 1, page_size: 6},
      success: function (res) {
        console.log(res)
        if (res.data.code === 1) {
          res.data.list.forEach(val => {
            val.isplaying = 0
          })
          that.setData({list: res.data.list})
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/static/img/filed.png'
          })
        }
      }
    })
  }
})