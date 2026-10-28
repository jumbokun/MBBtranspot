const test = require('node:test')
const assert = require('node:assert')
const { newOrderId, photoPath } = require('../miniprogram/lib/order')

test('order ids carry the local date and time and a random suffix', () => {
  const at = new Date(2026, 0, 5, 9, 3, 7)
  assert.strictEqual(newOrderId(at, () => 0), '20260105-090307-0000')
  assert.match(newOrderId(at, () => 0.999999), /^20260105-090307-[0-9a-z]{4}$/)
})

test('ids made in the same second differ', () => {
  const at = new Date()
  const ids = new Set(Array.from({ length: 200 }, () => newOrderId(at)))
  assert.ok(ids.size > 190)
})

test('each photo of an order gets its own path', () => {
  assert.strictEqual(photoPath('X', 0, 'http://tmp/abc.PNG'), 'orders/X/photo-1.png')
  assert.strictEqual(photoPath('X', 2, 'wxfile://tmp_abc.jpeg'), 'orders/X/photo-3.jpeg')
  assert.strictEqual(photoPath('X', 1, 'wxfile://noext'), 'orders/X/photo-2.jpg')
})
