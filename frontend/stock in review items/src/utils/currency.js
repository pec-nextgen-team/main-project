const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats a number as an Indian Rupee amount, e.g. 63750 -> "₹63,750.00". */
export function formatCurrency(value) {
  const n = Number(value);
  return inr.format(Number.isFinite(n) ? n : 0);
}
