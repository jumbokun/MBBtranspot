const { quote } = require("../../../lib/pricing.js")

Page({
  data: {
    name: "",
    address: "",
    type: "",
    phone: "",
    note: "",
    weight: "",
    contentPrice: "",
    price: null
  },
  onShareAppMessage: function(option){

  },
  onLoad: function () {
    // The form page hands the submitted order over its event channel.
    this.getOpenerEventChannel().on('order', (order) => this.showOrder(order));
  },

  showOrder: function (order) {
    const price = quote(order.重量);
    this.setData({
      phone: order.手机,
      name: order.姓名,
      weight: order.重量,
      contentPrice: order.金额,
      address: order.收件人地址,
      type: order.类别,
      note: order.备注 || "无",
      price: price === null ? null : price.toFixed(2)
    });
  },
})
