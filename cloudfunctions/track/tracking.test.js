const test = require('node:test')
const assert = require('node:assert')
const http = require('http')
const { createTracker, httpJson } = require('./tracking')

function recorder(responses) {
  const calls = []
  const send = async (method, url, headers, body) => {
    calls.push({ method, url, headers, body })
    return responses.shift()
  }
  return { calls, send }
}

test('first query registers the number the user typed, then reads it', async () => {
  const shipment = { meta: { code: 200 }, data: { status: 'transit' } }
  const { calls, send } = recorder([{ meta: { code: 4016 } }, shipment])
  const result = await createTracker({ apiKey: 'k', send, api: 'https://x' })
    .track({ carrier: 'dhl', orderNum: ' 1234567890 ', firstQuery: true })

  assert.deepStrictEqual(result, shipment)
  assert.deepStrictEqual(calls.map((c) => c.method + ' ' + c.url), [
    'POST https://x/trackings/post',
    'GET https://x/trackings/dhl/1234567890',
  ])
  assert.deepStrictEqual(calls[0].body, { tracking_number: '1234567890', carrier_code: 'dhl' })
  assert.strictEqual(calls[1].headers['Tracking-Api-Key'], 'k')
})

test('a repeat query only reads', async () => {
  const { calls, send } = recorder([{ meta: { code: 200 } }])
  await createTracker({ apiKey: 'k', send }).track({ carrier: 'dhl-germany', orderNum: '00340434326733124494' })
  assert.deepStrictEqual(calls.map((c) => c.method), ['GET'])
})

test('bad input is answered without calling the API', async () => {
  const { calls, send } = recorder([])
  const t = createTracker({ apiKey: 'k', send })
  assert.strictEqual((await t.track({ carrier: 'ups', orderNum: '1234567890' })).meta.code, 4000)
  assert.strictEqual((await t.track({ carrier: 'dhl', orderNum: '12/../../x' })).meta.code, 4000)
  assert.strictEqual((await createTracker({ send }).track({ carrier: 'dhl', orderNum: '1234567890' })).meta.code, 5000)
  assert.strictEqual(calls.length, 0)
})

test('network failures come back as a failed envelope', async () => {
  const send = async () => { throw new Error('socket hang up') }
  const r = await createTracker({ apiKey: 'k', send }).track({ carrier: 'dhl', orderNum: '1234567890' })
  assert.deepStrictEqual(r.meta, { code: 5000, type: 'Error', message: 'socket hang up' })
})

test('httpJson sends the JSON body and parses the reply', async (t) => {
  let seen
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', (c) => { body += c })
    req.on('end', () => {
      seen = { method: req.method, key: req.headers['tracking-api-key'], body: JSON.parse(body) }
      res.end(JSON.stringify({ meta: { code: 200 } }))
    })
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  t.after(() => server.close())
  const url = `http://127.0.0.1:${server.address().port}/trackings/post`
  const reply = await httpJson('POST', url, { 'Tracking-Api-Key': 'k', 'Content-Type': 'application/json' }, { a: 1 }, http.request)
  assert.deepStrictEqual(reply, { meta: { code: 200 } })
  assert.deepStrictEqual(seen, { method: 'POST', key: 'k', body: { a: 1 } })
})
