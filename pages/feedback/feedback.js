const $global = getApp().globalData
Page({
  data: {
    imgs: [],
    errInfo: '',
    title: '',
    phone: '',
    content: ''
  },
  // 上传图片
  handleUpload () {
    const that = this
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        if (res.errMsg === "chooseImage:ok") {
          let imgs = that.data.imgs
          imgs.push({path: res.tempFilePaths[0], file: res.tempFiles[0]})
          that.setData({imgs})
        } else {
          wx.showToast({
            title: '无权获取',
            image: '/static/img/filed.png'
          })
        }
      },
    })
  },
  // 修改联系人
  handleDelete (e) {
    const that = this
    let index = e.currentTarget.dataset.index
    let imgs = that.data.imgs
    imgs.splice(index, 1)
    that.setData({imgs})
  },
  // 提交反馈
  handleSubmit () {
    const that = this
    that.setData({errInfo: ''})
    let imgs = that.data.imgs

    if (!($global.reg.phone.test(that.data.phone))) {
      that.setData({ errInfo: '请输入正确格式联系电话' })
    } else {
      if (imgs.length !== 0) {
        wx.uploadFile({
          url: $global.api + '/feedback',
          filePath: that.data.imgs[0].path,
          name: 'imgFile',
          formData: { title: that.data.title, phone: that.data.phone, content: that.data.content, openid: $global.openId },
          success(res) {
            if (res.data === '提交成功') {
              that.setData({title: '', phone: '', content: '', imgs: []})
              wx.showToast({
                title: '提交成功',
                duration: 4000
              })
            } else {
              wx.showToast({
                title: '提交失败',
                image: '/static/imgs/filed.png'
              })
            }
          }
        })
      } else {
        wx.request({
          url: $global.api + '/feedback',
          data: { title: that.data.title, phone: that.data.phone, content: that.data.content, openid: $global.openId },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'POST',
          success(res) {
            if (res.data.code === 1) {
              that.setData({ title: '', phone: '', content: '', imgs: [] })
              wx.showToast({
                title: '提交成功',
                duration: 4000
              })
            } else {
              wx.showToast({
                title: '提交失败',
                image: '/static/imgs/filed.png',
              })
            }
          }
        })
      }
    }

  },
  handleInput (e) {
    const that = this
    let index = Number(e.currentTarget.dataset.index)
    if (index === 1) {
      that.setData({title: e.detail.value})
    } else if (index === 2) {
      that.setData({phone: e.detail.value})
    } else if (index === 3) {
      that.setData({content: e.detail.value})
    }
  }
})