const app = getApp();
const history = require('../../lib/history.js');
const shipment = require('../../lib/shipment.js');

Page({
    data: {
        title: '查询历史',
        latestRecord: [],
        length: 0
    },

    // Lookups are billed per call, so the list refreshes on first load and
    // on pull-down; coming back to the tab only re-reads storage.
    onLoad() {
        this.refresh();
    },

    onShow() {
        const stored = history.load();
        this.setData({ latestRecord: stored, length: stored.length });
    },

    onPullDownRefresh() {
        this.refresh().then(() => wx.stopPullDownRefresh());
    },

    // Looks every stored number up again and saves the list once all
    // answers are in. A number whose lookup fails keeps its last entry.
    async refresh() {
        const stored = history.load();
        if (!stored.length) return;
        wx.showNavigationBarLoading();
        const updated = await Promise.all(stored.map(async (item) => {
            try {
                const res = await wx.cloud.callFunction({
                    name: 'track',
                    data: { carrier: item.carrier, orderNum: item.orderNum }
                });
                const result = shipment.parse(res.result);
                return shipment.ok(result) ? shipment.summary(item.orderNum, item.carrier, result.data) : item;
            } catch (e) {
                return item;
            }
        }));
        wx.hideNavigationBarLoading();
        // Keep any number looked up on another tab while this was running.
        const merged = history.load().map((item) => updated.find((u) => u.orderNum === item.orderNum) || item);
        history.save(merged);
        this.setData({ latestRecord: merged, length: merged.length });
    },

    toDetail(e) {
        app.globalData.trackingNum = e.currentTarget.dataset.ordernum;
        app.globalData.seco = e.currentTarget.dataset.carrier;
        app.globalData.firstQuery = false;
        wx.navigateTo({
            url: '/page/timeaxis/timeaxis'
        });
    },
})
