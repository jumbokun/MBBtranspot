const cloud = require('wx-server-sdk');
cloud.init()
//const YQ = require(__dirname+'/externalcall.js') //dirname = root of couldfunction, def. in config
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

    function wait(ms){
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    };
    //POST
    const option = {
        url: 'https://api.51tracking.com/v2/trackings/post',
        headers: {
            'Tracking-Api-Key': '5dd547c6-571c-4de4-a2be-211604359e7c',
            'Content-Type': 'application/json'
        },
        body: {
            "tracking_number": "00340434326733124494",
            "carrier_code": "dhl-germany"
        },
        json: true
    }

    function postOrder(error, response, body) {
        console.log(body);
        if (!error && (response.statusCode == 200 || response.statusCode == 4016)) { //successfully posted
            const options = {
                url: 'https://api.51tracking.com/v2/trackings/'+event.carrier+'/'+event.orderNum,
                headers: {
                    'Tracking-Api-Key': '5dd547c6-571c-4de4-a2be-211604359e7c',
                    'Content-Type': 'application/json',
                }
            }
            function trackShipment(error, response, body){
                if(!error){
                    res = body;
                }
            }
            request(options,trackShipment);
        }
    }

    //GET
    const options = {
        url: 'https://api.51tracking.com/v2/trackings/'+event.carrier+'/'+event.orderNum,
        headers: {
            'Tracking-Api-Key': '5dd547c6-571c-4de4-a2be-211604359e7c',
            'Content-Type': 'application/json',
        }
    }
    function trackShipment(error, response, body){
        if(!error){
            res = body;
        }
    }


    var temp = res;
    if(event.firstQuery) {request(option,postOrder);} else {request(options,trackShipment);} //POST, if success => GET
    //simple asycn process, not optimized yet!!!
    for (let index = 0; index < 100; index++) {
       if(temp == res){
          await wait(500);
          console.log(index+' time wait');
       }
    }

    return res;
}