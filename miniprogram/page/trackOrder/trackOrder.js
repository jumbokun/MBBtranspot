
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
        var trackingNum = (e.detail.value.orderNum || '').trim();
        if (!/^[A-Za-z0-9-]{5,40}$/.test(trackingNum)) {
            wx.showToast({ title: '请输入正确的快递单号', icon: 'none' });
            return;
        }
        app.globalData.firstQuery = true;
        app.globalData.trackingNum = trackingNum;
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