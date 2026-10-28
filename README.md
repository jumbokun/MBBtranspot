# MBBtranspot

给 MBB 物流公司做的微信小程序（2020 年，2026 年翻新）：客户在小程序里登记寄件信息，订单以邮件发到 MBB 公司邮箱，由客服人工联系；同时可以查询 DHL 物流轨迹，并保留最近 5 条查询记录。

A WeChat mini program for the MBB logistics company: customers submit shipping orders, which are mailed to MBB's staff, and track DHL parcels through the 51tracking API.

## 功能

1. **提交快递**：填写收件人、重量、内容物价值等，可附最多 3 张物品照片 → 邮件发到 MBB 邮箱（照片作为附件）→ 客服人工联系客户。确认页按 MBB 2020 年的价目表显示预计运费。
2. **订单查询**：输入单号、选择运输商，显示物流时间轴，并自动存入历史记录。
3. **历史记录**：最近 5 条查询，首次打开和下拉时刷新状态。

目前支持 DHL-EXPRESS（德国-中国）和 DHL-DE（德国境内）。

## 目录

```
miniprogram/          小程序本体（无构建步骤，开发者工具直接打开仓库根目录）
  page/               form 提交快递 · offer/order 订单确认 · trackOrder 订单查询
                      history 历史记录 · timeaxis 物流时间轴
  lib/                可测试的纯逻辑：history 历史记录 · shipment 物流结果 · order 订单号与照片路径 · pricing 运费
  components/         ThorUI 组件库（第三方，原样保留）
cloudfunctions/
  track/              调 51tracking v2：首次查询先登记单号，再读取轨迹
  sendMail/           校验订单、下载照片作附件、用 SMTP 发邮件
test/                 lib/ 的测试
```

## 部署

### 云函数环境变量（必填）

密钥不再写在代码里。在 **微信开发者工具 → 云开发控制台 → 云函数 → 选中函数 → 版本与配置 → 环境变量** 里设置：

| 云函数 | 变量 | 说明 |
|---|---|---|
| track | `TRACKING_API_KEY` | 51tracking 的 API Key |
| sendMail | `SMTP_USER` | 发件邮箱，例如 QQ 邮箱地址 |
| sendMail | `SMTP_PASS` | 该邮箱的 SMTP 授权码（不是登录密码） |
| sendMail | `MAIL_TO` | 接收订单的 MBB 邮箱，多个用逗号分隔 |
| sendMail | `SMTP_HOST` / `SMTP_PORT` | 可选，默认 `smtp.qq.com` / `465` |

没设置时，查询会提示失败、提交会弹出「提交失败」，云函数日志里会写明缺哪个变量。

### 上传

1. 开发者工具打开仓库根目录（`project.config.json` 在这里）。
2. 右键 `cloudfunctions/track`、`cloudfunctions/sendMail` →「上传并部署：云端安装依赖」。
3. 上传小程序代码并提交审核。

## 关联账号与费用

1. **51tracking**（https://www.51tracking.com/）提供物流查询 API，预付费 100 元 / 10000 次查询。账号需要从开发者朱博桢手中移交给 MBB 公司。历史页只在首次打开和下拉时刷新，就是为了省查询次数。
2. **腾讯云开发**：云函数资源每月免费 40000 GBs，单个用户单次用量在 5 GBs 以下，超出部分预扣费。目前也挂在开发者名下。

## 修改配置

- **收件人**：改 sendMail 的 `MAIL_TO` 环境变量，不用改代码。
- **增加运输商**：同时改 `miniprogram/app.js` 的 `globalData.carrier`（51tracking 的 carrier code）和 `globalData.carrierCN`（显示名称，顺序一致），以及 `cloudfunctions/track/tracking.js` 的 `CARRIERS`。可用的 code 见 51tracking 的 carriers 列表。
- **物流状态文字**：`miniprogram/lib/shipment.js` 的 `STATUS_TEXT`。时间轴上最新一条和「已签收」显示大图标（`transport` / `check`）。
- **运费**：`miniprogram/lib/pricing.js`。

## 待 MBB 确认

- **9–10 kg 的运费**：2020 年的代码里 9–9.5 kg 重复了 8 kg 的价格（比 8.5–9 kg 还便宜），9.5–10 kg 根本没有价格（报 0 元）。现在这两档显示「待客服报价」，拿到正确价格后填进 `pricing.js` 即可。
- 确认页文案「X 个工作日内」里的 X，以及提交页「条款1」按钮背后的条款内容，当年都没有填。

## 开发

```
npm run setup   # 安装两个云函数的依赖
npm run check   # 对所有 .js 做语法检查
npm test        # 22 个测试
```

GitHub Actions 每次推送都会跑这三步（Node 22）。

联系：jumbokun@outlook.com，邮件请注明 Miniprogram。
