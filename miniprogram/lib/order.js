// Order ids and photo paths for the submit form.
//
// Both used to come from per-phone counters (orderNum, imageID) that started
// at 1, so ids repeated across customers and photo "1.png" from one customer
// overwrote another's in cloud storage.

function pad(n) {
  return String(n).padStart(2, '0')
}

// "20260115-143205-k3f9": readable date and time plus 4 random base-36 chars.
function newOrderId(now = new Date(), random = Math.random) {
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const suffix = Math.floor(random() * 36 ** 4).toString(36).padStart(4, '0')
  return `${date}-${time}-${suffix}`
}

// orders/<id>/photo-1.jpg, keeping the picked file's extension.
function photoPath(orderId, index, tempFilePath) {
  const match = /\.(\w{2,5})$/.exec(tempFilePath || '')
  const ext = match ? match[1].toLowerCase() : 'jpg'
  return `orders/${orderId}/photo-${index + 1}.${ext}`
}

module.exports = { newOrderId, photoPath }
