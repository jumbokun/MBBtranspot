// Turns an order submitted by the mini program into the mail MBB's staff receive.

// [form field name, label in the Chinese half, label in the English half]
const FIELDS = [
  ['姓名', '姓名', 'Name'],
  ['手机', '手机', 'Telephone'],
  ['收件人地址', '地址', 'Address'],
  ['类别', '类别', 'Category'],
  ['重量', '重量(kg)', 'Weight (kg)'],
  ['金额', '内容物价值(CNY)', 'Declared value (CNY)'],
  ['联系方式', '联系邮箱', 'Contact email'],
  ['备注', '备注', 'Note'],
]
const REQUIRED = ['姓名', '手机', '收件人地址', '类别', '重量', '金额', '联系方式']
const MAX_FIELD = 200
const MAX_PHOTOS = 3

class OrderError extends Error {}

// Accepts { order } from the current mini program and { context: "<json>" }
// from builds released before the rewrite.
function parseOrder(event) {
  let order = event.order
  if (!order && typeof event.context === 'string') {
    try {
      order = JSON.parse(event.context)
    } catch (e) {
      throw new OrderError('order is not valid JSON')
    }
  }
  if (!order || typeof order !== 'object') throw new OrderError('order is missing')

  const clean = { id: String(order.id || '').slice(0, 40) }
  for (const [name] of FIELDS) {
    const value = order[name] === undefined || order[name] === null ? '' : String(order[name]).trim()
    if (value.length > MAX_FIELD) throw new OrderError(`${name} is longer than ${MAX_FIELD} characters`)
    if (!value && REQUIRED.includes(name)) throw new OrderError(`${name} is required`)
    clean[name] = value
  }

  const photos = Array.isArray(order.imageFileID) ? order.imageFileID : []
  if (photos.length > MAX_PHOTOS) throw new OrderError(`at most ${MAX_PHOTOS} photos`)
  if (!photos.every((id) => typeof id === 'string' && id.startsWith('cloud://'))) {
    throw new OrderError('photos must be cloud storage file IDs')
  }
  clean.imageFileID = photos
  return clean
}

function buildMail(order, { from, to }, missingPhotos = []) {
  const zh = FIELDS.map(([name, label]) => `${label}: ${order[name] || '-'}`)
  const en = FIELDS.map(([name, , label]) => `${label}: ${order[name] || '-'}`)
  const lines = [...zh, '————————————————————————————————', ...en]
  if (order.imageFileID.length) lines.push('', `照片 / Photos: ${order.imageFileID.length - missingPhotos.length} attached`)
  if (missingPhotos.length) lines.push('未能附上 / Could not attach:', ...missingPhotos)
  return {
    from,
    to,
    replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order['联系方式']) ? order['联系方式'] : undefined,
    subject: `小程序订单-${order['姓名']}-${order.id}`,
    text: lines.join('\n') + '\n',
  }
}

module.exports = { FIELDS, OrderError, parseOrder, buildMail }
