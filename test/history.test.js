const test = require('node:test')
const assert = require('node:assert')
const { HISTORY_KEY, LIMIT, upsert, migrateLegacy } = require('../miniprogram/lib/history')

const entry = (n) => ({ orderNum: String(n), carrier: 'dhl', status: 'transit' })

function memoryStorage(initial) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    keys: () => [...data.keys()],
    get: (k) => data.get(k),
    set: (k, v) => data.set(k, v),
    remove: (k) => data.delete(k),
  }
}

test('upsert puts the newest lookup first and keeps five', () => {
  let list = []
  for (let n = 1; n <= 7; n++) list = upsert(list, entry(n))
  assert.deepStrictEqual(list.map((e) => e.orderNum), ['7', '6', '5', '4', '3'])
  assert.strictEqual(list.length, LIMIT)
})

test('looking a number up again moves it to the top instead of duplicating it', () => {
  const list = upsert([entry(3), entry(2), entry(1)], { ...entry(1), status: 'delivered' })
  assert.deepStrictEqual(list.map((e) => e.orderNum), ['1', '3', '2'])
  assert.strictEqual(list[0].status, 'delivered')
})

test('history stored under an openid moves to the fixed key', () => {
  const openid = 'oAbCdEfGhIjKlMnOpQrStUvWxYz0'
  const storage = memoryStorage({
    [openid]: [entry(9), entry(8)],
    orderNum: 12,
    imageID: 4,
  })
  const list = migrateLegacy(storage)
  assert.deepStrictEqual(list.map((e) => e.orderNum), ['9', '8'])
  assert.deepStrictEqual(storage.data.get(HISTORY_KEY).map((e) => e.orderNum), ['9', '8'])
  assert.ok(!storage.data.has(openid))
  assert.strictEqual(storage.data.get('orderNum'), 12, 'unrelated keys are left alone')
})

test('migration keeps current entries ahead of legacy ones and is idempotent', () => {
  const storage = memoryStorage({ [HISTORY_KEY]: [entry(1)], oAbCdEfGhIjKlMnOpQrStUvWxYz0: [entry(1), entry(2)] })
  migrateLegacy(storage)
  migrateLegacy(storage)
  assert.deepStrictEqual(storage.data.get(HISTORY_KEY).map((e) => e.orderNum), ['1', '2'])
})
