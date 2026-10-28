// Reading 51tracking v2 answers returned by the track cloud function.

// 51tracking's status values, as shown to customers.
const STATUS_TEXT = {
  pending: '等待查询',
  notfound: '暂无信息',
  transit: '运输途中',
  pickup: '到达待取',
  delivered: '已签收',
  undelivered: '投递失败',
  exception: '运输异常',
  expired: '运输过久',
}

// The function returned a JSON string before 2026 and an object since.
function parse(result) {
  if (typeof result === 'string') {
    try {
      return JSON.parse(result)
    } catch (e) {
      return { meta: { code: 5000, message: 'unreadable answer' }, data: null }
    }
  }
  return result || { meta: { code: 5000, message: 'empty answer' }, data: null }
}

function ok(result) {
  return Boolean(result && result.meta && result.meta.code === 200 && result.data)
}

// "2020-08-19T10:31:05+08:00" -> "2020-08-19 10:31:05"
function formatTime(iso) {
  if (!iso) return ''
  return String(iso).substring(0, 10) + ' ' + String(iso).substr(11, 8)
}

function statusText(status) {
  return STATUS_TEXT[status] || STATUS_TEXT.transit
}

// Checkpoints newest first. The latest one and any delivery get the large
// node with an icon; the rest are small dots.
function timeline(trackinfo) {
  return (trackinfo || []).map((point, i) => {
    const delivered = point.checkpoint_status === 'delivered'
    const big = delivered || i === 0
    return Object.assign({}, point, {
      iconImage: delivered ? 'check' : 'transport',
      title: big,
      xtitle: !big,
    })
  })
}

// The entry the history tab stores for one tracking number.
function summary(orderNum, carrier, data) {
  return {
    orderNum,
    carrier,
    lastEvent: data.lastEvent || '',
    lastUpdateTime: formatTime(data.lastUpdateTime),
    status: data.status || 'transit',
    statusText: statusText(data.status),
  }
}

module.exports = { parse, ok, formatTime, statusText, timeline, summary }
