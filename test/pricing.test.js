const test = require('node:test')
const assert = require('node:assert')
const { quote } = require('../miniprogram/lib/pricing')

test('half-kilo steps up to 30 kg', () => {
  assert.strictEqual(quote('0.2'), 23.47)
  assert.strictEqual(quote(0.5), 23.47)
  assert.strictEqual(quote(0.51), 28.14)
  assert.strictEqual(quote(8.5), 81.78)
  assert.strictEqual(quote(10.2), 86.96)
  assert.strictEqual(quote(30), 152.81)
})

test('per-kilo rates above 30 kg, rounded to cents', () => {
  assert.strictEqual(quote(31), 158.81)
  assert.strictEqual(quote(70), 330.02)
  assert.strictEqual(quote(100), 527.97)
  assert.strictEqual(quote(300.5), 1851.43)
})

test('weights without a usable price go to staff', () => {
  assert.strictEqual(quote(9.2), null)
  assert.strictEqual(quote(9.9), null)
  assert.strictEqual(quote(0), null)
  assert.strictEqual(quote(-1), null)
  assert.strictEqual(quote(''), null)
  assert.strictEqual(quote(100000), null)
})
