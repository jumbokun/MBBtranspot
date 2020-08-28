Page({
  data: {
  },
  onLoad: function (options) {

  },
  custom_service: function () {
    wx.showToast({
      title: '跳转中',
      icon: "none"
    })
    wx.navigateTo({
      url: '/page/' + JSON.stringify(e.custom_service.value), //跳转页留给你了
    })
  }
})