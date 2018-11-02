const $global = getApp().globalData
Page({
  data: {
    form: {
      start_dist: '请选择出发地点',
      start_dist_detail: '',
      end_dist: '请选择目的地址',
      end_dist_detail: '',
      phone: '',
      transorm_number: '',
      end_date: '请选择到达日期',
      end_time: '请选择到达时间'
    },
    start_detail: '',    
    errInfo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 选择器赋值方案
  handleChange (e) {
    let index = Number(e.currentTarget.dataset.index)
    const that = this
    let form = that.data.form
    let str = ''
    if (typeof(e.detail.value) === 'string') {
      str = e.detail.value
    } else {
      e.detail.value.forEach(val => {
        str += val + ' '
      })
    }
    let changeItem = ['start_dist', 'end_dist', 'end_date', 'end_time']
    form[changeItem[index]] = str
    that.setData({form})
  },
  // 输入框赋值方案
  handleInput (e) {
    const that = this
    let form = that.data.form
    let key = e.currentTarget.dataset.key
    form[key] = e.detail.value
    if (key === 'start_dist_detail') {
      that.setData({start_detail: ''})
    }
    that.setData({form})
  },
  // 获取添加联系人姓名
  handleName (e) {
    this.setData({cName: e.detail.value})
  },
  // 提交或者保存
  handleClick (e) {
    const that = this
    that.setData({errInfo: ''})
    let index = Number(e.currentTarget.dataset.index)
    let data = that.data.form
    data.start_dist === '请选择出发地点' ? data.start_dist = '' : ''
    data.end_dist === '请选择目的地址' ? data.end_dist = '' : ''
    data.end_date === '请选择到达日期' ? data.end_date = '' : ''
    data.end_time === '请选择到达时间' ? data.end_time = '' : ''
    // data.start_dist_detail = data.start_dist_detail || that.data.start_detail 
    console.log(data)
    if (!($global.reg.phone.test(data.phone))) {
      that.setData({errInfo: '请输入正确格式的手机号码'})
    } else {
      let url = ''
      // 0 为保存到常用， 1为创建
      index === 1 ? url = $global.api + '/safe' : url = $global.api + '/shortcut'
      wx.request({
        url,
        data: { ...data, openid: $global.openId },
        header: { "Content-Type": "application/x-www-form-urlencoded"},
        method: 'POST',
        success: function(res) {
          if (res.data.code === 1) {
            wx.redirectTo({
              url: '/pages/going/going?id=' + res.data.tid,
            })
          }
        }
      })
    }
  },
  // 获取当前位置
  handlePosition () {
    const that = this
    wx.getLocation({
      success: function (res) {
        wx.request({
          url: $global.api + '/position',
          data: { latitude: res.latitude, longitude: res.longitude, openid: $global.openId },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'PUT',
          success: function (res1) {
            console.log(res1)
            if (res1.data.code === 1) {
              let p = res1.data.location.province + ' ' + res1.data.location.city + ' ' + res1.data.location.district
              let form = that.data.form
              form.start_dist = p
              // let start_detail = res1.data.location.street + ' ' + res1.data.location.street_number
              // form.start_dist_detail = start_detail
              that.setData({form})
            } else {
              wx.showToast({
                title: '获取位置失败',
                image: '/static/img/filed.png'
              })
            }
          }
        })
      }
    })
  },
  // 获取当前日期
  handleDate () {
    const that = this
    let s = new Date()
    let y = s.getFullYear()
    let m = (s.getMonth() + 1) < 10 ? '0' + (s.getMonth() + 1) : s.getMonth() + 1
    let d = s.getDate() <= 10 ? '0' + s.getDate() : s.getDate()
    let st = y + '-' + m + '-' + d
    let form = that.data.form
    form.end_date = st
    that.setData({form})
  },
  // 添加快速联系人
  handleContact () {
    const that = this
    that.setData({errInfo: ''})
    let phone = that.data.form.phone
    if ($global.reg.phone.test(phone)) {
      that.setData({showModal: 1})
    } else {
      that.setData({errInfo: '请输入正确的联系电话'})
    }
  },
  // 取消弹框
  handleCancel () {
    this.setData({showModal: 0})
  },
  // 添加联系人
  handleAdd () {
    const that = this
    this.setData({errAdd: ''})
    if (!that.data.cName) {
      this.setData({ errAdd: '请输入联系人姓名' })      
    } else {
      wx.request({
        url: $global.api + '/contact',
        data: { name: that.data.cName, phone: that.data.form.phone, openid: $global.openId },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          if (res.data.code === 1) {
            wx.showToast({
              title: '保存成功',
              success: function () {
                that.handleCancel()
                that.setData({checkIndex: -1})
              }
            })
          } else {
            wx.showToast({
              title: '网络错误',
              image: '/static/img/filed.png'
            })
          }
        }
      })
    }
  },
  // 获取全部联系人
  handleList: function () {
    const that = this
    wx.request({
      url: $global.api + '/contact',
      data: { openid: $global.openId },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code === 1) {
          that.setData({ contact: res.data.contact_list, showModal: 2 })
        } else {
          wx.showToast({
            title: '网络错误',
            image: '/static/img/filed.png'
          })
        }
      }
    })
  },
  // 选择联系人
  handleCheck (e) {
    const that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    let form = that.data.form
    let cPhone = e.currentTarget.dataset.phone
    that.setData({checkIndex: index, cPhone })
    setTimeout(() => {
      that.handleCancel()
    }, 200)
  }
})