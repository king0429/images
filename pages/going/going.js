const $global = getApp().globalData
Page({
  data: {
    is_record: 0,
    is_position: 0,
    showModal: 0,
    endPhone: '',
    errInfo: '',
    stateInfo: '',
    showDetail: 0,
    showPosition: 0,
    showClass: '',
    slideClass: '',
    funList: [
      { name: '联系人通话', icon: 'iconfont icon-jisuanqi'},
      { name: '录音', icon: 'iconfont icon-luyin'},
      { name: '当前位置', icon: 'iconfont icon-Shapecopy'},
      { name: '设置', icon: 'iconfont icon-shezhi'}
    ]
  },
  onLoad (e) {
    const that = this
    that.setData({tid: e.id})
    wx.request({
      url: $global.api + '/safe',
      data: { openid: $global.openId, id: e.id},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'GET',
      success: function(res) {
        if (res.data.code === 1) {
          console.log(res)
          that.setData({showDetail: 1, travelDetail: {end_dist: res.data.detail.end_dist, end_dist_detail: res.data.detail.end_dist_detail, date_time: res.data.detail.end_date + ' ' + res.data.detail.end_time}, travel: res.data.detail})
          console.log(that)
        } else {
          wx.showToast({
            title: '网络错误'
          })
        }
      }
    })
  },
  // 长按结束行程
  handleClick () {
    this.setData({showModal: 1, window: {title: '确认结束？', content: '请输入创建行程时填写的联系人联系方式,取消成功后我们将以短信形式告知对方。'}})
  },
  // 隐藏弹框
  handleCancel () {
    this.setData({showModal: 0, window: {}})
  },
  // 获取input值
  handleInput (e) {
    this.setData({endPhone: e.detail.value})
  },
  // 确认取消
  handleSure () {
    this.setData({errInfo: ''})
    let p = this.data.endPhone
    const that = this
    if (!($global.reg.phone.test(p))) {
      that.setData({errInfo: '请输入正确的手机号'})
    } else {
      wx.request({
        url: $global.api + '/safe',
        data: {id: that.data.tid, openid: $global.openId, phone: p},
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'PUT',
        success: function(res) {
          if (res.data.code === 1) {
            wx.showToast({
              title: '取消成功',
              image: '/static/img/success.png',
              success: function () {
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/togo/togo',
                  })
                }, 300)
              }
            })
          } else {
            wx.showToast({
              title: res.data.errMsg,
              image: '/static/img/filed.png'
            })
          }
        }
      })
    }
  },
  // 功能按钮
  handleOperate (e) {
    const that = this
    let index = Number(e.currentTarget.dataset.index)
    // 微信录音功能对象
    let recorder = wx.getRecorderManager()    
    console.log(index)
    if (index === 0) {
      // 打电话
      if (that.data.is_record === 1) {
        // 结束录音接口
      } else {
        wx.makePhoneCall({
          phoneNumber: that.data.travel.phone.toString(),
        })
      }
    } else if (index === 1) {
      // 录音
      if (that.data.is_record === 0) {
        recorder.start({format: 'mp3'})
        recorder.onStart(() => {
          that.setData({is_record: 1, stateInfo: '正在录音, 60秒后自动结束，前往我的录音查看', showClass: 'flash'})
        })
      } else {
        recorder.stop()
        recorder.onStop(this.handleEndRecord)
      }
    } else if (index === 2) {
      if (that.data.is_position === 0) {
        that.setData({ is_position: 1, slideClass: ''})
        wx.getLocation({
          success: function (res) {
            wx.request({
              url: $global.api + '/position',
              data: { latitude: res.latitude, longitude: res.longitude, travel_id: that.data.tid, openid: $global.openId },
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              method: 'PUT',
              success: function (res1) {
                console.log(res1)
                if (res1.data.code === 1) {
                  let positionDetail = res1.data.position_detail.nation + ' ' + res1.data.position_detail.province + ' ' + res1.data.position_detail.district + ' ' + res1.data.position_detail.street_number
                  that.setData({ positionDetail, slideClass: 'slidedown', is_position: 0 })
                }
              }
            })
          }
        })
      }
    } else if (index === 3) {
      wx.navigateTo({
        url: '/pages/settings/settings',
      })
    }
  },
  // 结束录音接口
  handleEndRecord (res) {
    console.log(res)
    const that = this
    wx.uploadFile({
      url: $global.api + '/record',
      filePath: res.tempFilePath,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      name: 'record',
      formData: {tid: that.data.tid, openid: $global.openId, showClass: ''},
      success: function (res) {
        that.setData({stateInfo: '', is_record: 0})
      }
    })
  }
})