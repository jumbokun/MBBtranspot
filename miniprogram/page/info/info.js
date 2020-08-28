Page({
  /**
   * 页面的初始数据
   */
  data: {
    trackNumber: 1,
    acPerson: "Tester",

    dataObj: null,

    name: "tester",
    iconList: [{
      name: "friendadd",
      size: 30
    }, {
      name: "arrowright",
      size: 30
    }]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let str = "dataObj";
    this.setData({
      [str]: JSON.parse(options.dataObj)
    });

    /**
       // 一小时无用功 :D
       let a = 1;
       let b = 1;
       for (let i in this.data.dataObj) {
         a = a + 1;
         b = 1;
         for (let j in this.data.ob) {
           b = b + 1;
           if (a == b) {
             this.data.dataObj[i] = this.data.ob[j];
           }
         }
       };
      */

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})