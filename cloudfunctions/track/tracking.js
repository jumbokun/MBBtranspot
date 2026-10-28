// 51tracking v2 client: register a tracking number, then read its events.
const https = require('https')

const API = 'https://api.51tracking.com/v2'
const CARRIERS = ['dhl', 'dhl-germany'] // keep in sync with globalData.carrier in miniprogram/app.js
const ORDER_NUM = /^[A-Za-z0-9-]{5,40}$/
const TIMEOUT_MS = 8000

// Sends one JSON request and resolves with the parsed body. `request` is
// https.request in production and http.request in tests.
function httpJson(method, url, headers, body, request = https.request) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body)
    const req = request(url, {
      method,
      headers: payload ? { ...headers, 'Content-Length': Buffer.byteLength(payload) } : headers,
      timeout: TIMEOUT_MS,
    }, (res) => {
      let text = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { text += chunk })
      res.on('end', () => {
        try {
          resolve(JSON.parse(text))
        } catch (e) {
          reject(new Error(`51tracking answered HTTP ${res.statusCode} with non-JSON body`))
        }
      })
    })
    req.on('timeout', () => req.destroy(new Error(`51tracking did not answer within ${TIMEOUT_MS} ms`)))
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// Errors come back in 51tracking's own envelope so the mini program has one
// code path: meta.code !== 200 means "show the failure toast".
function failure(code, message) {
  return { meta: { code, type: 'Error', message }, data: null }
}

function createTracker({ apiKey, send = httpJson, api = API }) {
  const headers = { 'Tracking-Api-Key': apiKey, 'Content-Type': 'application/json' }

  return {
    async track({ carrier, orderNum, firstQuery }) {
      if (!CARRIERS.includes(carrier)) return failure(4000, `unsupported carrier: ${carrier}`)
      orderNum = String(orderNum || '').trim()
      if (!ORDER_NUM.test(orderNum)) return failure(4000, 'tracking number must be 5-40 letters, digits or dashes')
      if (!apiKey) return failure(5000, 'TRACKING_API_KEY is not set on the track cloud function')

      try {
        if (firstQuery) {
          // Registering a number that already exists returns meta.code 4016;
          // either way the GET below tells the real state.
          await send('POST', `${api}/trackings/post`, headers, { tracking_number: orderNum, carrier_code: carrier })
        }
        return await send('GET', `${api}/trackings/${carrier}/${encodeURIComponent(orderNum)}`, headers)
      } catch (e) {
        return failure(5000, e.message)
      }
    },
  }
}

module.exports = { CARRIERS, createTracker, httpJson }
