const mta = require('../../utils/mta_analysis.js');
const app = getApp();
Page({
    data: {
        title: '查询历史',
        error: null,
        latestRecord: [],
        length: 0
    },
    onLoad() {
        this.getHistory();
    },
    onReady() {
    },
    onShow() {
        wx.showToast({
            title: '正在更新历史记录',
            icon: 'loading',
            duration: 3500
          })
    },
    onPullDownRefresh() {
        this.getHistory();
    },

    getHistory() {
        console.log("invoked")
        var changedResult;
        var that = this;

        wx.getStorage({
            key: app.globalData.usersOpenId,
            success: function (result) {
                
                console.log(result.data);

                changedResult = result.data;
                that.setData({
                    length: result.data.length
                })
                for (let i in result.data) {

                    console.log(i);

                    wx.cloud.callFunction({
                        name: "track",
                        data: {
                            carrier: result.data[i].carrier,
                            orderNum: result.data[i].orderNum
                        },
                        success: function (res) {

                            console.log(res.result);

                            res.result = JSON.parse(res.result);
                            var newo;

                            if (result.data[i].lastUpdateTime != res.result.data.lastUpdateTime) {
                                newo = {
                                    "orderNum": result.data[i].orderNum,
                                    "carrier": result.data[i].carrier,
                                    "lastEvent": res.result.data.lastEvent,
                                    "lastUpdateTime": res.result.data.lastUpdateTime.substring(0, 10) + ' ' + res.result.data.lastUpdateTime.substr(11, 8),
                                    "status": res.result.data.status,
                                };
                                changedResult[i] = newo;
                            }
                        }
                    })
                }

                console.log(changedResult);
                console.log(result.data);

                if(changedResult != result.data){
                    wx.setStorage({
                      data: changedResult,
                      key: app.globalData.usersOpenId,
                    })
                }
                that.setData({
                    latestRecord: changedResult
                })
                console.log(changedResult);
                console.log(that.data.latestRecord);
            }
        })
        console.log("eof")
    },

    toDetail: function(e) {
        console.log(e);
        setTimeout(() => {
          console.log(e+"inside");
          }, 2000);
        app.globalData.orderNum = e.currentTarget.dataset.ordernum;
        app.globalData.seco = e.currentTarget.dataset.carrier;
        app.globalData.firstQuery = false;
        wx.navigateTo({
            url: '/page/timeaxis/timeaxis'
        })
    },
})