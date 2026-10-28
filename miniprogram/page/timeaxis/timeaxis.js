let globalData = getApp().globalData;
var app = getApp();
const history = require('../../lib/history.js');
Page({
  data: {
    loading: true,
    resu: '',
    orderNum: '',
    carrier: '',
    date: '',
    trackinfo: JSON,
    transNum: 0,
  },
  onLoad: function (options) {



    var that = this;
    //http request
    var ca = app.globalData.carrier[app.globalData.index];
    var du = 5000;
    if(!app.globalData.firstQuery){
       ca = app.globalData.seco; 
       du = 2500;
    }
    wx.showToast({
      title: '正在查询',
      icon: 'loading',
      duration: du
    })
    wx.cloud.callFunction({
      name: "track",
      data: {
        carrier: ca,
        orderNum: app.globalData.orderNum,
        firstQuery: app.globalData.firstQuery
      },
      success: function (res) {
        console.log(res.result);
        app.globalData.shipment = JSON.parse(res.result);
        if (app.globalData.shipment.meta.code != 200) {
          wx.showToast({
            title: '查询失败，请检查运输公司或订单是否错误！',
            duration: 2000,
            mask: true,
            icon: 'none',
            complete: function () {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 2000);
            }
          })
        }
        that.setData({
          loading: false
        });
        console.log(app.globalData.shipment.data);
        that.setData({
          date: app.globalData.shipment.data.created_at.substring(0, 10) + ' ' + app.globalData.shipment.data.created_at.substr(11, 8)
        })
        that.setData({
          trackinfo: app.globalData.shipment.data.origin_info.trackinfo
        })
        var temp = that.data.trackinfo;
        for (let index = 0; index < temp.length; index++) {
          // if(temp[index].checkpoint_status == "transit"){ //default  
          // };
          if (temp[index].checkpoint_status == "delivered") {
            temp[index].iconImage = "check"
            app.globalData.transNum = app.globalData.transNum - 1;
            temp[index].title = true;
            temp[index].xtitle = false;
            app.globalData.transNum = 0;
          } else {
            temp[index].iconImage = "transport"
            temp[index].title = false;
            temp[index].xtitle = true;
            if (app.globalData.transNum == 0) {
              temp[index].title = true;
              temp[index].xtitle = false;
            } else {
              temp[index].title = false;
              temp[index].xtitle = true;
            }
            app.globalData.transNum = app.globalData.transNum + 1;
          }
          that.setData({
            trackinfo: temp
          })
          var js = {
            "orderNum": app.globalData.orderNum,
            "carrier": app.globalData.carrier[app.globalData.index],
            "lastEvent": app.globalData.shipment.data.lastEvent,
            "lastUpdateTime": app.globalData.shipment.data.lastUpdateTime.substring(0, 10) + ' ' + app.globalData.shipment.data.lastUpdateTime.substr(11, 8),
            "status": app.globalData.shipment.data.status
          };
          history.save(history.upsert(history.load(), js));
        }
      },
      fail: console.error
    })
    //赋值
    that.setData({
      orderNum: app.globalData.orderNum
    })

    that.setData({
      carrier: app.globalData.carrierCN[app.globalData.index]
    })

  }
})