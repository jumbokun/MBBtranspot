Page({
  data: {
    hasCoupon: true,
    insufficient: false,
    dataObj: null,
    name: "zzz",
    address: "aaa",
    type: "kkkk",
    phone: "111",
    note: "无",
    weight: "",
    contentPrice: 100,
    shippingPrice: 100.00
  },
  onLoad: function (options) {

    //读取传来的数据
    let str = "dataObj"
    this.setData({
      [str]: JSON.parse(options.dataObj)
    });

    //把数据绑定到该页面——不知道为啥不能直接调用很烦
    var that = this
    this.setData({
      phone: that.data.dataObj.手机
    })
    this.setData({
      name: that.data.dataObj.姓名
    })
    this.setData({
      weight: that.data.dataObj.重量
    })
    this.setData({
      shippingPrice: that.data.dataObj.price
    })
    this.setData({
      contentPrice: that.data.dataObj.金额
    })
    this.setData({
      address: that.data.dataObj.收件人地址
    })
    this.setData({
      type: that.data.dataObj.类别
    })
    this.setData({
      note: that.data.dataObj.备注
    })
  },
  chooseAddr() {
    //还没做
    wx.navigateTo({
      url: "../address/address"
    })
  },
  btnPay() {
    //还没改
    wx.navigateTo({
      url: "../success/success"
    })
    this.data.dataObj.status = "paying"

    //通过app.globaldata取回订单号
    var app = getApp(); //获取小程序实例 = 获取全局变量
    let currentListNumber = app.globalData.currList[app.globalData.currList.length] //*String

    //将新订单数据与该订单号绑定
    console.log("test dataobj" + that.data.dataObj)
    wx.setStorage({
      key: currentListNumber,
      name: that.data.dataObj.姓名,
      data: JSON.stringify(this.data.dataObj), // 对象要序列化
    })
  },
})