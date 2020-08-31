const cloud = require('wx-server-sdk')
cloud.init()
//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: '550681829@qq.com', //邮箱账号
    pass: 'fggfbebhdnlobbac' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  var jsData = JSON.parse(event.context);
  var url;
  var filelist = [];
  console.log(jsData);
  filelist = jsData.imageFileID;

  const result = await cloud.getTempFileURL({
    fileList: filelist,
  })
  // for (let index = 0; index < jsData.imageFileID.length; index++) {
  //   const resu = await cloud.downloadFile({
  //     fileID: jsData.imageFileID[index].toString(),
  //   })
  //   const buffer = resu.fileContent;
  //   console.log(buffer.toString())
  // }

  filelist = result.fileList[0].tempFileURL;

   // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '来自朱博桢-小程序 <550681829@qq.com>',
    // 主题
    subject: '小程序订单' + jsData.id,
    // 收件人
    //to: '550681829@qq.com',
    to: 'gaosongde@gmail.com', //高哥Gmail
    // 邮件内容，text或者html格式
    text: '\n' + "姓名: " + jsData.姓名 + "\n手机: " + jsData.手机 + '\n地址: ' + jsData.收件人地址 + '\n类别:' + jsData.类别 + '\n重量(kg): ' + jsData.重量 + '\n内容物价值:' + jsData.金额 + '\n联系方式: ' + jsData.联系方式 + '\n备注: ' + jsData.备注 + '————————————————————————————————\n' + "Name: " + jsData.姓名 + "\ntelephone: " + jsData.手机 + '\naddress: ' + jsData.收件人地址 + '\ncategory:' + jsData.类别 + '\nweight(kg): ' + jsData.重量 + '\nPackage contents value:' + jsData.金额 + '\nContact information: ' + jsData.联系方式 + '\nfurther info: ' + jsData.备注 +'\n'+ filelist, //可以是链接，也可以是验证码

  };

  let res = await transporter.sendMail(mail);
  return res;

}