export function formatINR(value, { showSign = false } = {}) {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const sign = value < 0 ? '-' : showSign && value > 0 ? '+' : ''
  return `${sign}₹${formatted}`
}
