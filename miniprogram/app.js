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
    },

    onLaunch() {
        wx.cloud.init({ traceUser: true })
        // History used to be keyed by openid; move it to the fixed key once.
        history.migrateLegacy(history.wxStorage())
    },
})
