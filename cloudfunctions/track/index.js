const cloud = require('wx-server-sdk');
cloud.init()
//const YQ = require(__dirname+'/externalcall.js')
const request = require('request');
// 云函数入口函数
exports.main = async (event, context) => {

    var that = this;  
    var res;
    //const options = {
    //    url: 'https://api-eu.dhl.com/track/shipments?trackingNumber='+event.YQNum+'&language=zh&limit=10',
    //    headers: {
    //        'Tracking-Api-Key': '5dd547c6-571c-4de4-a2be-211604359e7c',
    //        'Content-Type': 'application/json'
    //    }
    //}

    const options = {
        url: 'https://api.51tracking.com/v2/carriers/',
        headers: {
            'Tracking-Api-Key': '5dd547c6-571c-4de4-a2be-211604359e7c',
            'Content-Type': 'application/json'
        }
    }
    function callback(error, response, body) {
        if (!error) {
            //var info = JSON.parse(body);
            res = body;
            console.log('res in func'+res);
        }
    }
    request(options,callback);
    function wait(ms){
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    };
    await wait(2000); // 等待HTTP同步
    console.log('res outside'+res);
    return res;
}