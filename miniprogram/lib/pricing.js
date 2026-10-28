// Estimated shipping price in EUR from MBB's 2020 rate card.

// [upper bound in kg, price]; a weight falls in the first row whose bound
// it does not exceed. null means the 2020 card gave no usable price:
// 9-9.5 kg repeated the 8 kg price (cheaper than 8.5-9 kg) and 9.5-10 kg
// was missing, so the code returned 0. Staff quote those by hand until MBB
// confirms the real figures.
const UP_TO_30KG = [
  [0.5, 23.47], [1, 28.14], [1.5, 32.45], [2, 36.77], [2.5, 41.05],
  [3, 45.05], [3.5, 49.05], [4, 53.06], [4.5, 57.06], [5, 61.07],
  [5.5, 63.65], [6, 66.24], [6.5, 68.83], [7, 71.42], [7.5, 74.01],
  [8, 79.19], [8.5, 81.78], [9, 84.37], [9.5, null], [10, null],
  [10.5, 86.96], [11, 88.73], [11.5, 90.49], [12, 92.25], [12.5, 94.02],
  [13, 95.78], [13.5, 97.55], [14, 99.31], [14.5, 101.08], [15, 102.84],
  [15.5, 104.61], [16, 106.37], [16.5, 108.14], [17, 109.90], [17.5, 111.66],
  [18, 113.43], [18.5, 115.19], [19, 116.96], [19.5, 118.72], [20, 120.49],
  [20.5, 122.25], [21, 123.86], [21.5, 125.47], [22, 127.08], [22.5, 128.69],
  [23, 130.29], [23.5, 131.90], [24, 133.51], [24.5, 135.12], [25, 136.73],
  [25.5, 138.34], [26, 139.95], [26.5, 141.55], [27, 143.16], [27.5, 144.77],
  [28, 146.38], [28.5, 147.99], [29, 149.60], [29.5, 151.21], [30, 152.81],
]
const MAX_KG = 99999

// Returns the price rounded to cents, or null when staff have to quote.
function quote(weight) {
  const w = parseFloat(weight)
  if (!(w > 0) || w > MAX_KG) return null
  let price
  const row = UP_TO_30KG.find(([max]) => w <= max)
  if (row) price = row[1]
  else if (w <= 70) price = 154.42 + (w - 30) * 4.39
  else if (w <= 300) price = 329.97 + (w - 70) * 6.60
  else price = 1847.97 + (w - 300) * 6.92
  return price === null ? null : Math.round(price * 100) / 100
}

module.exports = { quote }
