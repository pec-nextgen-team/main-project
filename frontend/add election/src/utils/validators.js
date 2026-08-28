export function isValidEmail(value) {
  if (!value) return true // email is optional per spec
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidPhone(value) {
  return /^[6-9]\d{9}$/.test(value)
}

export function isValidAadhaar(value) {
  if (!value) return true // optional
  return /^\d{12}$/.test(value.replace(/\s/g, ''))
}

export function isValidPan(value) {
  if (!value) return true // optional
  return /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value.toUpperCase())
}

export function isValidPinCode(value) {
  return /^\d{6}$/.test(value)
}

export function isValidDate(value) {
  if (!value) return false
  const d = new Date(value)
  return !Number.isNaN(d.getTime()) && d <= new Date()
}
