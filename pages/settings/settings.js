const $global = getApp().globalData
Page({
  data: {
    funList: [
      {name: '常用行程单' },
      {name: '行程历史', url: '/pages/historyList/historyList'},
      {name: '历史录音', url: '/pages/recordList/recordList'},
      {name: '常用联系人', url: '/pages/contacts/contacts'},
      {name: '账号安全', url: '/pages/safecenter/safecenter'},
      {name: '意见反馈', url: '/pages/feedback/feedback'}
    ]
  },
  handleClick (e) {
    const that = this
    let funList = this.data.funList
    let index = Number(e.currentTarget.dataset.index);
    let url = funList[index].url
    if (url) {
      wx.navigateTo({
        url,
      })
    }
    // switch (index) {
    //   case 1:

    //   break
    // }
  }
})