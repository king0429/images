// pages/togo/togo.js
Page({
  data: {
    funList: [
      { name: '历史行程', icon: 'iconfont icon-lishi', url: '/pages/historyList/historyList'},
      { name: '常用行程单', icon: 'iconfont icon-changyongshili', url: '/'},
      { name: '意见反馈', icon: 'iconfont icon-kefu'},
      { name: '设置', icon: 'iconfont icon-shezhi'}
    ]
  },
  handleCreate () {
    wx.navigateTo({
      url: '/pages/item_create/item_create',
    })
  },
  handleClick (e) {
    let index = Number(e.currentTarget.dataset.index)
    if (index === 3) {
      wx.navigateTo({
        url: '/pages/settings/settings',
      })
    }
  }
})