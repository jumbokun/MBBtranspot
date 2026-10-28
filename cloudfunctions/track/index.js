const cloud = require('wx-server-sdk')
const { createTracker } = require('./tracking')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const tracker = createTracker({ apiKey: process.env.TRACKING_API_KEY })

// event: { carrier, orderNum, firstQuery }
exports.main = async (event) => tracker.track(event)
