const history = require('./lib/history.js')

App({
    globalData: {
        //data for timeaxis
        shipment: JSON,
        carrier: ['dhl', 'dhl-germany'],
        carrierCN: ['DHL-EXPRESS（德国-中国）', 'DHL-DE(德国境内）'],
        index: 0,
        firstQuery: true,
        orderNum: '',
        transNum: 0,
        titleTrans: true,
        created: '',
        //end of data for timeaxis

        //data for history
        seco: '',
        limitHistoryNum: history.LIMIT, // max number of stored order number of history page
        lastUpdatedStatus: '',
        lastUpdateTime: '',
        //end of data for history
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
