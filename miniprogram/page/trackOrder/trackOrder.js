
Page({
    data:{
        title: '查询历史',
        error: null,
        OrderNum: '',
        resu: '',
        array: ['DHL-EXPRESS（德国-中国）','DHL-DE(德国境内）'],
        index: 0
    },
    onShareAppMessage: function(option){

    },
    formSubmit: function(e) {
        var app = getApp(); //获取小程序实例 = 获取全局变量
        var that=this;
        app.globalData.firstQuery = true;
        app.globalData.orderNum = e.detail.value.orderNum;
        wx.navigateTo({
          url: '/page/timeaxis/timeaxis',
        })
    },
    bindPickerChange: function(e) {
        var that=this;
        var app = getApp(); //获取小程序实例 = 获取全局变量
        that.setData({
          index: e.detail.value
        });
        app.globalData.index = e.detail.value;
    },
})