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
    shippingPrice: 100.00,
    price: 0
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
    var that = this;
    var p = 0;
    var w = parseFloat(that.data.weight);

    if(w<=0.5) {p = 23.47};
    if(0.5<w && w<=1) {p = 28.14};
    if(1<w && w<=1.5) {p = 32.45};
    if(1.5<w && w<=2) {p = 36.77};
    if(2<w && w<=2.5) {p = 41.05};
    if(2.5<w && w<=3) {p = 45.05};
    if(3<w && w<=3.5) {p = 49.05};
    if(3.5<w && w<=4) {p = 53.06};
    if(4<w && w<=4.5) {p = 57.06};
    if(4.5<w && w<=5) {p = 61.07};
    if(5<w && w<=5.5) {p = 63.65};
    if(5.5<w && w<=6) {p = 66.24};
    if(6<w && w<=6.5) {p = 68.83};
    if(6.5<w && w<=7) {p = 71.42};
    if(7<w && w<=7.5) {p = 74.01};
    if(7.5<w && w<=8) {p = 79.19};
    if(8<w && w<=8.5) {p = 81.78};
    if(8.5<w && w<=9) {p = 84.37};
    if(9<w && w<=9.5) {p = 79.19};
    if(10<w && w<=10.5) {p = 86.96};
    if(10.5<w && w<=11) {p = 88.73};
    if(11.5<w && w<=12) {p = 92.25};
    if(12.5<w && w<=13) {p = 95.78};
    if(13.5<w && w<=14) {p = 99.31};
    if(14.5<w && w<=15) {p = 102.84};
    if(15.5<w && w<=16) {p = 106.37};
    if(16.5<w && w<=17) {p = 109.90};
    if(17.5<w && w<=18) {p = 113.43};
    if(18.5<w && w<=19) {p = 116.96};
    if(19.5<w && w<=20) {p = 120.49};
    if(20.5<w && w<=21) {p = 123.86};
    if(21.5<w && w<=22) {p = 127.08};
    if(22.5<w && w<=23) {p = 130.29};
    if(23.5<w && w<=24) {p = 133.51};
    if(24.5<w && w<=25) {p = 136.73};
    if(25.5<w && w<=26) {p = 139.95};
    if(26.5<w && w<=27) {p = 143.16};
    if(27.5<w && w<=28) {p = 146.38};
    if(28.5<w && w<=29) {p = 149.60};
    if(29.5<w && w<=30) {p = 152.81};
    if(11<w && w<=11.5) {p = 90.49};
    if(12<w && w<=12.5) {p = 94.02};
    if(13<w && w<=13.5) {p = 97.55};
    if(14<w && w<=14.5) {p = 101.08};
    if(15<w && w<=15.5) {p = 104.61};
    if(16<w && w<=16.5) {p = 108.14};
    if(17<w && w<=17.5) {p = 111.66};
    console.log(p)
    if(18<w && w<=18.5) {p = 115.19};
    if(19<w && w<=19.5) {p = 118.72};
    if(20<w && w<=20.5) {p = 122.25};
    if(21<w && w<=21.5) {p = 125.47};
    if(22<w && w<=22.5) {p = 128.69};
    if(23<w && w<=23.5) {p = 131.90};
    if(24<w && w<=24.5) {p = 135.12};
    if(25<w && w<=25.5) {p = 138.34};
    if(26<w && w<=26.5) {p = 141.55};
    if(27<w && w<=27.5) {p = 144.77};
    if(28<w && w<=28.5) {p = 147.99};
    if(29<w && w<=29.5) {p = 151.21};
    if(30<w && w<=70) {p = 154.42+(w-30)*4.39};
    if(70<w && w<=300) {p = 329.97+(w-70)*6.60};
    if(300<w && w<=99999) {p = 1847.97+(w-300)*6.92};
    p.toFixed(2);
    that.setData({
      price:p
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