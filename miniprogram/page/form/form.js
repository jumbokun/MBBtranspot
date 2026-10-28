const form = require("../../components/utils/formValidation.js")
const { newOrderId, photoPath } = require("../../lib/order.js")

const MAX_PHOTOS = 3

const RULES = [{
  name: "姓名",
  rule: ["required", "minLength:2", "maxLength:20"],
  msg: ["请输入姓名", "姓名必须2个或以上字符", "姓名不能超过20个字符"]
}, {
  name: "手机",
  rule: ["required", "minLength:6"],
  msg: ["请输入手机号", "请输入正确的手机号"]
}, {
  name: "收件人地址",
  rule: ["required"],
  msg: ["请输入收件人地址"]
}, {
  name: "类别",
  rule: ["required"],
  msg: ["请输入类别"]
}, {
  name: "重量",
  rule: ["required", "isAmount"],
  msg: ["请输入重量", "重量请填数字，最多两位小数"]
}, {
  name: "金额",
  rule: ["required", "isAmount"],
  msg: ["请输入金额", "请输入正确的金额，允许保留两位小数"]
}, {
  name: "联系方式",
  rule: ["required", "isEmail"],
  msg: ["请输入邮箱", "请输入正确的邮箱"]
}];

Page({
  data: {
    flag1: 0,
    flag2: 0,
    flag: 1,
    submitting: false,
    images: []
  },

  onShareAppMessage: function (option) {

  },

  async formSubmit(e) {
    const values = e.detail.value;
    const error = form.validation(values, RULES);
    if (error) {
      wx.showToast({ title: error, icon: "none" });
      return;
    }
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    wx.showLoading({ title: "正在提交", mask: true });

    const order = Object.assign({}, values, { id: newOrderId() });
    try {
      // Upload every photo under this order's own folder, then mail once.
      const uploads = await Promise.all(this.data.images.map((filePath, i) =>
        wx.cloud.uploadFile({ cloudPath: photoPath(order.id, i, filePath), filePath })
      ));
      order.imageFileID = uploads.map((u) => u.fileID);

      const res = await wx.cloud.callFunction({ name: "sendMail", data: { order } });
      if (!res.result || !res.result.ok) throw new Error((res.result && res.result.error) || "sendMail failed");
    } catch (err) {
      console.error(err);
      wx.hideLoading();
      this.setData({ submitting: false });
      wx.showModal({
        title: "提交失败",
        content: "订单没有发出，请检查网络后重试。",
        showCancel: false
      });
      return;
    }

    wx.hideLoading();
    this.setData({ submitting: false });
    wx.navigateTo({
      url: "/page/offer/order/order",
      success: (nav) => nav.eventChannel.emit("order", order)
    });
  },

  formReset: function (e) {
    this.setData({ images: [] });
  },

  authenticity: function (e) {
    var that = this
    this.setData({
      flag1: !that.data.flag1
    })
    this.setData({
      flag: !(that.data.flag1 && that.data.flag2)
    })
  },

  termsChecking: function (e) {
    var that = this
    this.setData({
      flag2: !that.data.flag2
    })
    this.setData({
      flag: !(that.data.flag1 && that.data.flag2)
    })
  },

  chooseImage(e) {
    wx.chooseMedia({
      count: MAX_PHOTOS - this.data.images.length,
      mediaType: ["image"],
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const picked = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({ images: this.data.images.concat(picked).slice(0, MAX_PHOTOS) });
      }
    });
  },

  removeImage(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    this.setData({ images: this.data.images.filter((_, i) => i !== idx) });
  },

  handleImagePreview(e) {
    const idx = e.currentTarget.dataset.idx;
    wx.previewImage({
      current: this.data.images[idx],
      urls: this.data.images,
    });
  }

})
