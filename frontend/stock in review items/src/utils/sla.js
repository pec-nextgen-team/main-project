/**
 * SLA helpers
 * ---------------------------------------------------------------------------
 * Every complaint must be resolved within 3 days of approval/processing.
 * computeSlaInfo() derives a human-readable label, a visual "tone", and a
 * progress percentage from a complaint's createdAt/status/closure fields.
 *
 * `referenceDate` defaults to `new Date()` (the real current time), which is
 * what the app should always use once wired to a live backend. The bundled
 * sample dataset (src/data/sampleComplaints.js) passes a fixed reference
 * date so the demo numbers ("1 Day Left", "Overdue by 1 Day", ...) stay
 * consistent with the sample "Raised On" dates instead of drifting as real
 * time passes.
 */

export const SLA_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export function computeSlaInfo(complaint, referenceDate = new Date()) {
  const created = new Date(complaint.createdAt);
  const deadline = new Date(created.getTime() + SLA_DAYS * DAY_MS);

  if (complaint.status === 'Closed') {
    const resolvedOn = complaint.closure?.date || complaint.updatedAt;
    return {
      label: `Resolved on ${formatDate(resolvedOn)}`,
      tone: 'resolved',
      percent: 100,
    };
  }

  const msLeft = deadline.getTime() - referenceDate.getTime();
  const daysLeft = Math.ceil(msLeft / DAY_MS);
  const elapsed = referenceDate.getTime() - created.getTime();
  const percent = Math.min(100, Math.max(0, (elapsed / (SLA_DAYS * DAY_MS)) * 100));

  if (daysLeft < 0) {
    return {
      label: `Overdue by ${Math.abs(daysLeft)} Day${Math.abs(daysLeft) === 1 ? '' : 's'}`,
      tone: 'overdue',
      percent: 100,
    };
  }

  if (daysLeft === 0) {
    return { label: 'Due Today', tone: 'warning', percent };
  }

  return {
    label: `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left`,
    tone: daysLeft === 1 ? 'warning' : 'ok',
    percent,
  };
}

export function isOverdue(complaint, referenceDate = new Date()) {
  return computeSlaInfo(complaint, referenceDate).tone === 'overdue';
}

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
}

export function formatDateTime(dateInput) {
  const date = new Date(dateInput);
  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${formatDate(date)}, ${time}`;
}
