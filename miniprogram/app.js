const mta = require('./utils/mta_analysis.js');
App({
    onLaunch() {
        mta.App.init({
            "appID": "wx07c305f03ad0c81f"
        });
    },

    getUserData(cb) {
        var that = this;
        if (this.userData.token) {
            typeof cb == "function" && cb(this.userData.token)
        } else {
            //调用登录接口
            wx.login({
                success: function (res) {
                    let code = res.code;
                    console.log(code)
                    wx.getUserInfo({
                        success: function (res) {}
                    })
                }
            })
        }
    },

    globalData: {
        usersOpenId: '1',
        currList: ["0"], // openId 对应的tracknumber数组
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
        limitHistoryNum: 5, // max number of stored order number of history page
        lastUpdatedStatus: '',
        lastUpdateTime: '',
        //end of data for history
    },

    onShow: function (options) {
        var that = this;
        wx.cloud.init(),
        wx.setStorage({
          data: 1,
          key: 'imageID',
        })
            wx.cloud.callFunction({
                name: 'login',
                complete: res => {
                    console.log('callFunction test result: ', res, res.result.openid)
                    that.globalData.usersOpenId = res.result.openid
                    wx.getStorage({
                        key: that.globalData.usersOpenId,
                        fail: function(e){
                            wx.setStorage({
                              data: [],
                              key: that.globalData.usersOpenId,
                            })
                        }
                      })  
                    wx.getStorage({
                        key: 'orderNum',
                        success: function (resu) { //要用不一样的变量名 再用res就出错了
                            //console.log("数组的输出形式:" + that.globalData.currList)
                            //console.log("订单号列表：" + resu.data)
                            if (resu.data == null) {
                                wx.setStorage({
                                  data: 1,
                                  key: 'orderNum',
                                })
                            }
                            //that.globalData.currList = that.globalData.currList.concat(resu.data.split(","))
                        }
                    })  

                    //初始化历史记录表 调试用
                    // wx.setStorage({
                    //     data: 
                    //         [{
                    //             "orderNum": "00340434326733124494",
                    //             "carrier": "dhl-germany",
                    //             "lastEvent": "The shipment has been successfully delivered,2020-08-19",
                    //              "status": "delivered"
                    //         }],
                    //     key: that.globalData.usersOpenId
                    // })


                    // test data
                    // var a = [{
                    //     "orderNum": "00340434326733124494",
                    //     "carrier": "dhl-germany",
                    //     "lastEvent": "The shipment has been successfully delivered,2020-08-19",
                    //      "status": "delivered"
                    //             },
                    //             {
                    //                 "orderNum": "00340434326123134494",
                    //                 "carrier": "dhl-germany",
                    //                 "lastEvent": "The shipment has been successfully delivered,2020-08-22",
                    //                  "status": "transit"
                    //             },
                    //         ]
                    // var b = [{
                    //     "orderNum": "00340434326123133212",
                    //     "carrier": "dhl-germany",
                    //     "lastEvent": "The shipment has been successfully delivered,2020-08-31",
                    //      "status": "transit"
                    // }]

                    // var result = [];
                    // for(var i in b){
                    //     result.push(b[i]);
                    // }
                    // for(var i in a){
                    //     result.push(a[i]);}

                    // console.log(result);
                    //end of 初始化历史记录表


                }
            })




    },
})