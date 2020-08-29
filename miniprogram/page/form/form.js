const form = require("../../components/utils/formValidation.js")

Page({
  data: {
    flag1: 0,
    flag2: 0,
    flag: 1,
  },

  onLoad: function(options) {
    wx.cloud.init()

    wx.cloud.callFunction({ //获取客户的list
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res, res.result.openid)
      }
    })
  },

  formSubmit: function(e) {
    //表单规则
    let rules = [{
      name: "姓名",
      rule: ["required", "minLength:2", "maxLength:20"], //可使用区间，此处主要测试功能
      msg: ["请输入姓名", "姓名必须2个或以上字符", "姓名不能超过20个字符"]
    }, {
      name: "手机",
      rule: ["required","minlength:6"],
      msg: ["请输入手机号", "请输入正确的手机号"]
    }, {
      name: "重量",
      rule: ["required", "range:[1,200]"],
      msg: ["请输入区间数字", "重量：请输入1-200之间的数字"]
    }, {
      name: "类别",
      rule: ["required"],
      msg: ["请输入类别"]
    }, {
        name: "收件人地址",
        rule: ["required"],
        msg: ["请输入收件人地址"]
    }, {
      name: "金额",
      rule: ["required", "isAmount"],
      msg: ["请输入金额", "请输入正确的金额，允许保留两位小数"]
    }, {
      name: "联系方式",
      rule: ["required"],
      msg: ["请输入邮箱","请输入正确的邮箱"]
    }];
    //进行表单检查
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    if (!checkRes) {
      wx.showToast({
        title: "验证通过!",
        icon: "none"
      });

    //算出快递费用(abandon)

      
    //处理订单编号
      var app = getApp(); //获取小程序实例 = 获取全局变量
      let currentListNumber = parseInt(wx.getStorageSync('OrderNum')) + 1;
      e.detail.value.id = currentListNumber;
      wx.setStorage({
        key: 'OrderNum',
        data: currentListNumber.toString(),
      })

    //将订单数据与订单号绑定
      wx.setStorage({
        key: currentListNumber.toString(),
        data: JSON.stringify(e.detail.value), // 对象要序列化
      })
      //将订单号与openID绑定
      app.globalData.currList[app.globalData.currList.length] = currentListNumber.toString()
      wx.setStorage({
        key: app.globalData.usersOpenId,
        data: app.globalData.currList.join(","), // 数组要转成字符串
      })



      //查看当前storage信息
      //wx.getStorageInfo({
      //  success(resul) {
      //    console.log(resul.keys)
      //    console.log(resul.currentSize)
      //    console.log(resul.limitSize)
      //  }
      //})
      
      //将数据送至确认页面
      wx.navigateTo({
        url: '/page/offer/order/order?dataObj=' + JSON.stringify(e.detail.value),
      })

      wx.showToast({
        title: '信息已成功登记，请注意邮箱后续来信',
        duration: 1500
      })

      wx.cloud.callFunction({
        name:"sendMail",
        data:{
          id : currentListNumber.toString(),
          context : JSON.stringify(e.detail.value),
        },
        success(res){
          console.log("success", res)
        },
        fail(res){
          console.log("fail", res)
        }
      })

    } else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }
  },

  formReset: function(e) {
    console.log("清空数据")
  },

  authenticity: function(e) {
    var that = this
    this.setData({
      flag1: !that.data.flag1
    })
    this.setData({
      flag: !(that.data.flag1 && that.data.flag2)
    })
  },

  termsChecking: function(e) {
    var that = this
    this.setData({
      flag2: !that.data.flag2
    })
    this.setData({
      flag: !(that.data.flag1 && that.data.flag2)
    })
  }

})