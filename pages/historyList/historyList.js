const $global = getApp().globalData
import util from '../../utils/util.js';
Page({
  data: {
    historyList: [],
    page: 1,
    is_null: false,
    selIndex: -1
  },
  onLoad: function (options) {
    this.handleRequest()
  },
  onShow: function () {
    this.handleRequest()    
  },
  handleRequest: function (pz, swth) {
    const that = this 
    let page = this.data.hasShow ? that.data.page : 1
    // console.log('page:', page)
    let page_size = pz || 8
    wx.request({
      url: $global.api + '/history',
      data: { openid: $global.openId, page, page_size },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code === 1) {
          if (page === 1) {
            page++
            that.setData({historyList: res.data.history, page, hasShow: true})
          } else {
            if (res.data.history.length !== 0) {
              let historyList = that.data.historyList.concat(res.data.history)
              page++
              that.setData({ historyList, page, hasShow: true})
            } else {
              that.setData({is_null: true})
            }
          }
        } else {
          wx.showToast({
            title: '网络错误',
            image: '/static/img/filed.png'
          })
        }
      },
    })
  },
  handeClick: function (e) {
    this.setData({ selIndex: e.currentTarget.dataset.index })
    setTimeout(() => {
      this.setData({ selIndex: -1, hasShow: 0 })
      wx.navigateTo({
        url: '/pages/historyDetail/historydetail?id=' + e.currentTarget.dataset.item._id,
      })
    }, 240)
  },
  onReachBottom () {
    if (!this.data.is_null) {
      this.handleRequest()
    }
  }
})