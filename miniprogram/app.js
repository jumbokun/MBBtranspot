const history = require('./lib/history.js')

App({
    globalData: {
        // carriers offered on the search tab; keep in sync with CARRIERS in cloudfunctions/track
        carrier: ['dhl', 'dhl-germany'],
        carrierCN: ['DHL-EXPRESS（德国-中国）', 'DHL-DE(德国境内）'],
        index: 0,          // picker position on the search tab
        trackingNum: '',   // number the timeline page looks up
        firstQuery: true,  // true from the search tab: register the number first
        seco: '',          // carrier of a number opened from history
        orderNum: 1,       // counter for order ids on the form tab
    },

    onLaunch() {
        wx.cloud.init({ traceUser: true })
        // History used to be keyed by openid; move it to the fixed key once.
        history.migrateLegacy(history.wxStorage())
    },

    onShow() {
        var that = this;
        //并发时要去掉 oder 换个实现方法
        wx.setStorage({
            data: 1,
            key: 'imageID',
        })
        wx.getStorage({
            key: 'orderNum',
            complete: function (resu) {
                if (resu.data == null || isNaN(resu.data)) {
                    wx.setStorageSync('orderNum', 1)
                    that.globalData.orderNum = 1
                } else {
                    that.globalData.orderNum = resu.data;
                }
            }
        })
    },
})
