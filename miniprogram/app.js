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
                success: function(res) {
                    let code = res.code;
                    console.log(code)
                    wx.getUserInfo({
                        success: function(res) {}
                    })
                }
            })
        }
    },

    globalData: {
        usersOpenId: '1',
        currList: ["0"] // openId 对应的tracknumber数组
    },

    onShow: function(options) {
        var that = this;
        wx.cloud.init(),
            wx.cloud.callFunction({
                name: 'login',
                complete: res => {
                    console.log('callFunction test result: ', res, res.result.openid)
                    that.globalData.usersOpenId = res.result.openid
                    wx.getStorage({
                        key: 'OrderNum',
                        success: function(resu) { //要用不一样的变量名 再用res就出错了
                            //console.log("数组的输出形式:" + that.globalData.currList)
                            //console.log("订单号列表：" + resu.data)
                            if (resu.data == null) {
                              
                            }
                            that.globalData.currList = that.globalData.currList.concat(resu.data.split(","))
                            console.log("订单号列表：" + that.globalData.currList)
                            wx.getStorage({
                                key: 'orderNum',
                                success: function(res) {
                                    console.log(res.data)
                                },
                            })
                        }
                    })
                }
            })
    },
})