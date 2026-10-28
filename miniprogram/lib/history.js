// Tracking history kept in the mini program's local storage.
//
// wx storage is already private to one WeChat user in one mini program, so
// the list lives under a fixed key. Builds before 2026 keyed it by the
// user's openid, which forced every page to wait for a login round trip.

const HISTORY_KEY = 'trackHistory'
const LIMIT = 5
// openids are 28 characters and start with "o"
const LEGACY_KEY = /^o[\w-]{20,40}$/

// Puts `entry` first, drops an older copy of the same number, keeps LIMIT.
function upsert(list, entry) {
  const rest = (list || []).filter((item) => item.orderNum !== entry.orderNum)
  return [entry, ...rest].slice(0, LIMIT)
}

// Moves lists stored under an openid into HISTORY_KEY, after the entries
// already there. `storage` is { keys(), get(key), set(key, value), remove(key) }.
function migrateLegacy(storage) {
  let list = storage.get(HISTORY_KEY) || []
  for (const key of storage.keys()) {
    if (!LEGACY_KEY.test(key)) continue
    const legacy = storage.get(key)
    if (Array.isArray(legacy)) {
      for (const entry of legacy) {
        if (entry && entry.orderNum && !list.some((item) => item.orderNum === entry.orderNum)) {
          list = [...list, entry]
        }
      }
    }
    storage.remove(key)
  }
  storage.set(HISTORY_KEY, list.slice(0, LIMIT))
  return list
}

// wx.* storage wrapped in the shape migrateLegacy expects.
function wxStorage() {
  return {
    keys: () => wx.getStorageInfoSync().keys,
    get: (key) => {
      const value = wx.getStorageSync(key)
      return value === '' ? undefined : value
    },
    set: (key, value) => wx.setStorageSync(key, value),
    remove: (key) => wx.removeStorageSync(key),
  }
}

function load() {
  return wx.getStorageSync(HISTORY_KEY) || []
}

function save(list) {
  wx.setStorageSync(HISTORY_KEY, list)
}

module.exports = { HISTORY_KEY, LIMIT, upsert, migrateLegacy, wxStorage, load, save }
