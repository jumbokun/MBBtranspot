
Page({
    data:{
        title: '查询历史',
        error: null,
        OrderNum: '',
        resu: '',
        array: ['DHL-EXPRESS（德国-中国）','DHL-DE(德国境内）'],
        transCompany: '',
        index: 0
    },
    formSubmit: function(e) {
        var that=this;
        // wx.navigateTo({
        //   url: '/page/timeaxis/timeaxis',
        // })
        wx.cloud.callFunction({
            name: "track",
            data:{
                OrderNum : e.detail.value.OrderNum,
            },  
            success: function(res) {
                console.log(res.result) 
                that.setData({resu: JSON.stringify(res.result)});
            },
            fail: console.error
        })
        wx.showToast({
          title: '正在查询',
          icon: 'loading',
          duration: 2500
        })
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var that=this;
        that.setData({
          index: e.detail.value
        });
    },
})