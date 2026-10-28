const app = getApp();
const history = require('../../lib/history.js');
const shipment = require('../../lib/shipment.js');

Page({
  data: {
    loading: true,
    orderNum: '',
    carrier: '',
    date: '',
    trackinfo: [],
  },

  async onLoad() {
    const g = app.globalData;
    // From the search tab the carrier comes from the picker; from history it
    // is the carrier that number was saved with.
    const carrier = g.firstQuery ? g.carrier[g.index] : g.seco;
    const orderNum = g.trackingNum;
    const carrierIndex = g.carrier.indexOf(carrier);
    this.setData({ orderNum, carrier: carrierIndex >= 0 ? g.carrierCN[carrierIndex] : carrier });

    wx.showLoading({ title: '正在查询', mask: true });
    let result;
    try {
      const res = await wx.cloud.callFunction({
        name: 'track',
        data: { carrier, orderNum, firstQuery: g.firstQuery },
      });
      result = shipment.parse(res.result);
    } catch (e) {
      result = null;
    }
    wx.hideLoading();

    if (!shipment.ok(result)) {
      wx.showToast({ title: '查询失败，请检查运输公司或单号', icon: 'none', duration: 2000 });
      setTimeout(() => wx.navigateBack(), 2000);
      return;
    }

    const data = result.data;
    this.setData({
      loading: false,
      date: shipment.formatTime(data.created_at),
      trackinfo: shipment.timeline(data.origin_info && data.origin_info.trackinfo),
    });
    history.save(history.upsert(history.load(), shipment.summary(orderNum, carrier, data)));
  },
})
