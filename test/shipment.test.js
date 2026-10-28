const test = require('node:test')
const assert = require('node:assert')
const shipment = require('../miniprogram/lib/shipment')

const answer = {
  meta: { code: 200 },
  data: {
    status: 'delivered',
    created_at: '2020-08-17T08:00:00+08:00',
    lastEvent: 'The shipment has been successfully delivered',
    lastUpdateTime: '2020-08-19T10:31:05+08:00',
    origin_info: {
      trackinfo: [
        { Date: '2020-08-19 10:31', StatusDescription: 'Delivered', checkpoint_status: 'delivered' },
        { Date: '2020-08-18 09:00', StatusDescription: 'Out for delivery', checkpoint_status: 'transit' },
        { Date: '2020-08-17 08:00', StatusDescription: 'Picked up', checkpoint_status: 'transit' },
      ],
    },
  },
}

test('parse accepts the old JSON string and the new object', () => {
  assert.deepStrictEqual(shipment.parse(JSON.stringify(answer)), answer)
  assert.strictEqual(shipment.parse(answer), answer)
  assert.strictEqual(shipment.ok(shipment.parse('<html>')), false)
  assert.strictEqual(shipment.ok({ meta: { code: 4002 }, data: [] }), false)
  assert.strictEqual(shipment.ok(answer), true)
})

test('timeline marks the latest checkpoint and deliveries large', () => {
  const t = shipment.timeline(answer.data.origin_info.trackinfo)
  assert.deepStrictEqual(t.map((p) => [p.iconImage, p.title, p.xtitle]), [
    ['check', true, false],
    ['transport', false, true],
    ['transport', false, true],
  ])
  assert.deepStrictEqual(shipment.timeline([{ checkpoint_status: 'transit' }]).map((p) => p.title), [true])
  assert.deepStrictEqual(shipment.timeline(undefined), [])
})

test('summary is what the history tab shows', () => {
  assert.deepStrictEqual(shipment.summary('00340434326733124494', 'dhl-germany', answer.data), {
    orderNum: '00340434326733124494',
    carrier: 'dhl-germany',
    lastEvent: 'The shipment has been successfully delivered',
    lastUpdateTime: '2020-08-19 10:31:05',
    status: 'delivered',
    statusText: '已签收',
  })
  assert.strictEqual(shipment.statusText('something-new'), '运输途中')
})
