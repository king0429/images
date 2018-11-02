const $global = getApp().globalData;
Page({
  data: {
    name: '',
    phone: '',
    contact: [],
    showModal: 0,
    deleteTip: '删除'
  },
  onLoad () {
    const that = this
    wx.request({
      url: $global.api + '/contact',
      data: {openid: $global.openId},
      method: 'GET',
      success: function(res) {
        console.log(res)
        if (res.data.code === 1) {
          res.data.contact_list.forEach(val => {
            val.show = 1
          })
          that.setData({contact: res.data.contact_list})
        } else {
          wx.showToast({
            title: '网络错误',
            image: '/static/img/filed.png'
          })
        }
      }
    })
  },
  // 显示弹框
  handleModal (e) {
    let sw = e.currentTarget.dataset.switch
    if (!sw) {
      this.setData({ showModal: 1, modalTitle: '添加' })
    } else if (Number(sw) === 1) {
      let item = e.currentTarget.dataset.item
      let delContent = ' ' + item.name
      this.setData({ showModal: 2, delContent, delItem: item})
    } else if (Number(sw) === 2) {
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      this.setData({ showModal: 3, name: item.name, phone: item.phone, delItem: item, delIndex: index})
    }
  },
  // 添加联系人
  handleAdd () {
    const that = this
    that.setData({errInfo: ''})
    if (!that.data.name || that.data.name === '') {
      that.setData({errInfo: '请输入联系人姓名'})
    } else {
      if (!($global.reg.phone.test(that.data.phone))) {
        that.setData({errInfo: '请输入正确格式的手机号'})
      } else {
        wx.request({
          url: $global.api + '/contact',
          data: {name: that.data.name, phone: that.data.phone, openid: $global.openId},
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'POST',
          success: function(res) {
            if (res.data.code === 1) {
              let contact = that.data.contact
              contact.push({name: that.data.name, phone: that.data.phone, show: 1})
              that.setData({contact})
              that.handleCancel('保存成功')
            } else {
              wx.showToast({
                title: '网络错误',
                image: '/static/img/filed.png'
              })
            }
          }
        })
      }
    }
  },
  // 获取输入信息
  handleInput (e) {
    const that = this
    let index = Number(e.currentTarget.dataset.index)
    if (index === 1) {
      that.setData({name: e.detail.value})
    } else if (index === 2) {
      that.setData({ phone: e.detail.value })      
    }
  },
  // 取消提交
  handleCancel (str) {
    this.setData({ showModal: 0, modalTitle: '', delContent: '', name: '', phone: '', delItem: {}})
    typeof str !== 'object' ? 
    wx.showToast({
      title: typeof str === 'object' ? '' :  str
    }) : ''
  },
  // 删除联系人
  handleDelete (e) {
    const that = this
    let contact = that.data.contact
    let item = e.currentTarget.dataset.item
    wx.request({
      url: $global.api + '/contact',
      data: {openid: $global.openId, _id: that.data.delItem._id},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'DELETE',
      success: function(res) {
        if (res.data.code === 1) {
          console.log(res)
          contact.splice(e.currentTarget.dataset.index, 1)
          contact.forEach(val => {
            val.left = 0
          })
          that.setData({contact})
          that.handleCancel('删除成功')
        } else {
          wx.showToast({
            title: '网络错误',
            image: '/static/img/filed.png'
          })
        }
      }
    })
    that.setData({contact, deleteTip: '确认删除'})
  },
  // item 滚动条事件
  handleScroll (e) {
    console.log(e.currentTarget)
    if (e.target.offsetLeft === 0) {
    }
  },
  // 修改联系人
  handleUpdate () {
    const that = this
    that.setData({ errInfo: '' })
    if (!that.data.name || that.data.name === '') {
      that.setData({ errInfo: '请输入联系人姓名' })
    } else {
      if (!($global.reg.phone.test(that.data.phone))) {
        that.setData({ errInfo: '请输入正确格式的手机号' })
      } else {
        wx.request({
          url: $global.api + '/contact',
          data: { name: that.data.name, phone: that.data.phone, openid: $global.openId, _id: that.data.delItem._id },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'PUT',
          success: function (res) {
            // console.log(res)
            if (res.data.code === 1) {
              // console.log(res)
              let contact = that.data.contact
              // let el = that.data.delItem[that.data.delIndex]
              contact[that.data.delIndex].name = that.data.name
              contact[that.data.delIndex].phone = that.data.phone
              that.setData({ contact })
              console.log(that)
              that.handleCancel('修改成功')
            } else {
              wx.showToast({
                title: '网络错误',
                image: '/static/img/filed.png'
              })
            }
          }
        })
      }
    }
  },
  // 搜索
  handleSearch (e) {
    const that = this
    let key = e.detail.value
    let keyReg = new RegExp(key)
    let contact = that.data.contact
    contact.forEach(val => {
      if (e.detail.value) {
        val.show = 0
        if (keyReg.test(val.name) || keyReg.test(val.phone)) {
          val.show = 1
        } 
      } else {
        val.show = 1
      }
    })
    that.setData({contact})
  }
})