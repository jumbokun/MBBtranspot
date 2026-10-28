const test = require('node:test')
const assert = require('node:assert')
const nodemailer = require('nodemailer')
const { OrderError, parseOrder, buildMail } = require('./mail')

const order = {
  id: '20260101-ab12',
  姓名: '张三',
  手机: '+49 151 2345678',
  收件人地址: '上海市徐汇区某路 1 号',
  类别: '衣服',
  重量: '2.5',
  金额: '300',
  联系方式: 'zhang@example.com',
  备注: '',
  imageFileID: ['cloud://env.1234/orders/a.png'],
}

test('reads the current { order } shape and the legacy { context } string', () => {
  assert.deepStrictEqual(parseOrder({ order }), parseOrder({ context: JSON.stringify(order) }))
})

test('rejects missing, oversized and foreign input', () => {
  assert.throws(() => parseOrder({ order: { ...order, 姓名: '' } }), OrderError)
  assert.throws(() => parseOrder({ order: { ...order, 备注: 'x'.repeat(201) } }), OrderError)
  assert.throws(() => parseOrder({ order: { ...order, imageFileID: ['https://evil.example/x.png'] } }), OrderError)
  assert.throws(() => parseOrder({ order: { ...order, imageFileID: ['cloud://a', 'cloud://b', 'cloud://c', 'cloud://d'] } }), OrderError)
  assert.throws(() => parseOrder({ context: '{not json' }), OrderError)
})

test('the mail lists every field in both languages, separated on its own line', () => {
  const mail = buildMail(parseOrder({ order }), { from: 'bot <bot@example.com>', to: 'staff@example.com' })
  assert.strictEqual(mail.subject, '小程序订单-张三-20260101-ab12')
  assert.strictEqual(mail.replyTo, 'zhang@example.com')
  const lines = mail.text.split('\n')
  assert.ok(lines.includes('备注: -'))
  assert.ok(lines.includes('————————————————————————————————'))
  assert.ok(lines.includes('Weight (kg): 2.5'))
  assert.ok(lines.includes('照片 / Photos: 1 attached'))
})

test('nodemailer accepts the mail with photo attachments', async () => {
  const transport = nodemailer.createTransport({ jsonTransport: true })
  const mail = buildMail(parseOrder({ order }), { from: 'bot@example.com', to: 'staff@example.com' }, [])
  const info = await transport.sendMail({ ...mail, attachments: [{ filename: 'photo-1.png', content: Buffer.from('png') }] })
  const sent = JSON.parse(info.message)
  assert.strictEqual(sent.attachments[0].filename, 'photo-1.png')
  assert.deepStrictEqual(sent.to, [{ address: 'staff@example.com', name: '' }])
})
