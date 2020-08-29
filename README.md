# MBBtranspot

A Miniprogram for Wechat, which is able to submit orders to the server, remind the merchants in the form of emails, localize the DHL(and more, thanks to 51tracking) order query page and save the query order number so that you can quickly review it next time.

```
for(var i in b){
    result.push([i, b [i]]);}
console.log(result);
```
do works when you wanna convert a JSON into array!! 
---

This worked if you wanna code the json data and splice it or push or pop or shift it in array.

```
                    var a = {"1":{
                        "orderNum": "00340434326733124494",
                        "carrier": "dhl-germany",
                        "lastEvent": "The shipment has been successfully delivered,2020-08-19",
                         "status": "delivered"
                                },
                                "2":{
                                    "orderNum": "00340434326123134494",
                                    "carrier": "dhl-germany",
                                    "lastEvent": "The shipment has been successfully delivered,2020-08-22",
                                     "status": "transit"
                                },
                    }
                    var b = {"1":{
                        "orderNum": "00340434326123133212",
                        "carrier": "dhl-germany",
                        "lastEvent": "The shipment has been successfully delivered,2020-08-31",
                         "status": "transit"
                    },

                    }
                    var result = [];
                    for(var i in b){
                        result.push([i,b[i]]);
                    }
                    for(var i in a){
                        result.push([i, a[i]]);}
                    for (let index = 1; index < result.length; index++) {
                       result[index][0] = ''+(parseInt(result[index][0])+1);
                    }
```

---
important:
if you wanna use:
```
    <view class="list-view">
      <view class="list-item" hover-class="hover" hover-stay-time="150" bindtap="toDetail" data-orderNum="{{item.orderNum}}" data-carrier="{{item.carrier}}">
        <view class="content-box">
          <image src='../../static/images/index/tracking.png' class="logo"></image>
          <view class="des-box">
            <view class="tit">{{item.lastEvent}}</view>
            <view class="source">{{item.orderNum}}</view>
            <view class="time">{{item.lastUpdateTime}}</view>
            </view> 
        </view>
        <view class="status">
          {{item.status}}
        </view>
      </view>
    </view>
```
make sure you noticed that: 
```
    toDetail: function(e) {
        console.log(e);
        setTimeout(() => {
          console.log(e+"inside");
          }, 2000);
        app.globalData.orderNum = e.currentTarget.dataset.ordernum;
        app.globalData.seco = e.currentTarget.dataset.carrier;
        app.globalData.firstQuery = false;
        wx.navigateTo({
            url: '/page/timeaxis/timeaxis'
        })
    },
```
1: need a timeout, idk why
2: here e.currentTarget.dataset.ordernum <= ordernum must be lowercase !!!!!!