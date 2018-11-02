const $global = getApp().globalData
Page({
  data: {
    showModal: 0
  },
  onLoad: function (e) {
    const that = this
    that.setData({tid: e.id})
    wx.request({
      url: $global.api + '/history',
      data: {tid: that.data.tid, openid: $global.openId},
      method: 'GET',
      success: function(res) {
        if (res.data.code === 1) {
          that.setData({history: res.data.history, record_list: res.data.list})
        } else {
          wx.showToast({
            title: '网络错误',
            image: '/static/img/filed.png'
          })
        }
      },
    })
  },
  // 弹出
  handleModal: function () {
    this.setData({showModal: 1})
  },
  // 取消弹框
  handleCancel: function () {
    this.setData({showModal: 0})
  },
  // 删除行程
  handleDelete () {
    const that = this
    wx.request({
      url: $global.api + '/history',
      data: {openid: $global.openId, _id: that.data.tid},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'DELETE',
      success: function(res) {
        console.log(res)
        if (res.data.code === 1) {
          wx.showToast({
            title: '删除成功',
            success: function () {
              setTimeout(() => {
                wx.navigateBack()
              }, 500)
            }
          })
        }
      },
    })
  }
})