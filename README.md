# MBBtranspot
A Miniprogram for Wechat, which is able to submit orders to the server, remind the merchants in the form of emails, localize the DHL(and more, thanks to 51tracking) order query page and save the query order number so that you can quickly review it next time.

# 关联账号
1. 51tracking 是提供查询物流的API接口的公司，官网为https://www.51tracking.com/，需要从开发者朱博手中对接到MBB公司手中。
2. 小程序的后端使用了腾讯云服务，相关费用属于预扣款性质，目前也还挂在开发者朱博手中。

# 相关资费信息
1. 51tracking资费为100元 10000条查询的预付费
2. 腾讯云目前使用较多为云资源，每月免费40000GBs，根据调试经验单个用户单次用量在5GBs以下。一旦超过也会被扣费。

# 功能点
1. 提交订单 ——> 将信息发送邮件到MBB公司邮箱 ——> MBB客服人工联系客户
2. 查询及时物流情况，同时自动将其保存到历史记录中
3. 回看至多*5*条的历史查询记录。物流信息将在每次loading历史记录页面时刷新。

# 注意
1. 由于物流查询的API以及腾讯云都在国内，因此该小程序在使用过程中有较大的延迟感，每个页面的平均跳转时间长达3秒
2. 目前只支持到DHL-EXPRESS/DHL全球、DHL-DE的物流查询，后续添加需要查看51tracking的carriers信息
3. 所有物流信息都有一个default状态为transit，以防未知的错误
4. 后续添加物流商时需要注意返回值status的变化
5. 后续编写bindtap与data-name时注意wxml中只存在小学，在function中要注意e的值
6. 注意通讯nodejs程序的config中需要添加private: true 字段
7. 不同用户由于使用的是与openId关联的storage，应不存在存储冲突问题。
8. wx.storage： openID> {orderArray} > orderNum, carrier, lastEvent...

# 已知BUG
1. 当打开小程序后立马跳转到历史记录页面会无法正常读取，因为用户的login还没完成。

# 有关配置信息
1. 修改邮箱接收人：
couldfunctions > sendMail > index.js > main, line28 > to 变量
2. 修改/增加支持的物流商：
修改app.js中的globalData.carrier变量
修改page/trackOrder/trackOrder.js中 array变量，注意中英文对应关系
3. 通信问题：
多半应该在couldfunctions > track > index.js 通信部分，可以通过本地调试获取POST/GET的返回值中的API code来判断到底出了什么问题
4. 额外的物流状态
在timeaxis.js中 line 70, 85. 其中我定义了2个状态为trasport（default）和check（签收）。其他支持的状态还有：home,order,people
5. 更多请发邮件至jumbokun@Outlook.com, 注明Miniprogram

