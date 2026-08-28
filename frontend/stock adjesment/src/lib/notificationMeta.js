import {
  AlertTriangle,
  UserCog,
  Hourglass,
  CheckCircle2,
  Wrench,
  Search,
  CheckCheck,
  FileBarChart,
  ClipboardList,
  Bell,
} from 'lucide-react'

// Every backend NotificationType maps to display metadata used across
// the summary cards, tabs, filters, list rows, and the donut chart.
// category -> drives the "Alerts / Reminders / Updates / System" tabs + chart
// group -> drives the "Type" dropdown (Complaint / Assignment / SLA / Verification / Closure / System)

export const NOTIFICATION_TYPES = {
  SLA_OVERDUE: {
    label: 'Complaint Overdue Alert',
    icon: AlertTriangle,
    color: 'danger',
    category: 'alerts',
    group: 'sla',
    module: 'Complaint',
  },
  COMPLAINT_ASSIGNED: {
    label: 'Complaint Assigned',
    icon: UserCog,
    color: 'info',
    category: 'updates',
    group: 'assignment',
    module: 'Complaint',
  },
  SLA_REMINDER: {
    label: 'SLA Reminder',
    icon: Hourglass,
    color: 'warning',
    category: 'reminders',
    group: 'sla',
    module: 'Complaint',
  },
  COMPLAINT_VERIFIED: {
    label: 'Complaint Verified',
    icon: CheckCircle2,
    color: 'success',
    category: 'updates',
    group: 'verification',
    module: 'Complaint',
  },
  ACTION_COMPLETED: {
    label: 'Repair Completed',
    icon: Wrench,
    color: 'violet',
    category: 'updates',
    group: 'assignment',
    module: 'Repair',
  },
  INSPECTION_PENDING: {
    label: 'Inspection Pending',
    icon: Search,
    color: 'info',
    category: 'reminders',
    group: 'complaint',
    module: 'Complaint',
  },
  COMPLAINT_CLOSED: {
    label: 'Complaint Closed',
    icon: CheckCheck,
    color: 'success',
    category: 'updates',
    group: 'closure',
    module: 'Complaint',
  },
  REPORT_GENERATED: {
    label: 'Report Generated',
    icon: FileBarChart,
    color: 'success',
    category: 'system',
    group: 'system',
    module: 'Reports',
  },
  COMPLAINT_REGISTERED: {
    label: 'Complaint Registered',
    icon: ClipboardList,
    color: 'info',
    category: 'updates',
    group: 'complaint',
    module: 'Complaint',
  },
  REPAIR_STARTED: {
    label: 'Repair Started',
    icon: Wrench,
    color: 'violet',
    category: 'updates',
    group: 'assignment',
    module: 'Repair',
  },
  VERIFICATION_PENDING: {
    label: 'Verification Pending',
    icon: Hourglass,
    color: 'warning',
    category: 'reminders',
    group: 'verification',
    module: 'Complaint',
  },
  SYSTEM: {
    label: 'System Notice',
    icon: Bell,
    color: 'ink',
    category: 'system',
    group: 'system',
    module: 'System',
  },
}

// Tailwind class groups per semantic color, used by icon chips + badges.
export const COLOR_STYLES = {
  danger: {
    chipBg: 'bg-danger-50',
    chipText: 'text-danger-600',
    dot: 'bg-danger-600',
    badgeBg: 'bg-danger-50',
    badgeText: 'text-danger-700',
    ring: 'ring-danger-100',
    chart: '#dc2626',
  },
  warning: {
    chipBg: 'bg-warning-50',
    chipText: 'text-warning-600',
    dot: 'bg-warning-600',
    badgeBg: 'bg-warning-50',
    badgeText: 'text-warning-700',
    ring: 'ring-warning-100',
    chart: '#d97706',
  },
  success: {
    chipBg: 'bg-success-50',
    chipText: 'text-success-600',
    dot: 'bg-success-600',
    badgeBg: 'bg-success-50',
    badgeText: 'text-success-700',
    ring: 'ring-success-100',
    chart: '#16a34a',
  },
  info: {
    chipBg: 'bg-info-50',
    chipText: 'text-info-600',
    dot: 'bg-info-600',
    badgeBg: 'bg-info-50',
    badgeText: 'text-info-700',
    ring: 'ring-info-100',
    chart: '#2563eb',
  },
  violet: {
    chipBg: 'bg-violet-50',
    chipText: 'text-violet-600',
    dot: 'bg-violet-600',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    ring: 'ring-violet-100',
    chart: '#7c3aed',
  },
  ink: {
    chipBg: 'bg-ink-900/5',
    chipText: 'text-ink-600',
    dot: 'bg-ink-500',
    badgeBg: 'bg-ink-900/5',
    badgeText: 'text-ink-600',
    ring: 'ring-ink-900/10',
    chart: '#6b7690',
  },
}

export const PRIORITY_STYLES = {
  High: { bg: 'bg-danger-50', text: 'text-danger-700', ring: 'ring-danger-100' },
  Medium: { bg: 'bg-warning-50', text: 'text-warning-700', ring: 'ring-warning-100' },
  Low: { bg: 'bg-success-50', text: 'text-success-700', ring: 'ring-success-100' },
}

export const CATEGORY_LABELS = {
  all: 'All',
  unread: 'Unread',
  alerts: 'Alerts',
  reminders: 'Reminders',
  updates: 'Updates',
  system: 'System',
}

export const TYPE_GROUP_LABELS = {
  all: 'All Types',
  complaint: 'Complaint',
  assignment: 'Assignment',
  sla: 'SLA',
  verification: 'Verification',
  closure: 'Closure',
  system: 'System',
}

export function getTypeMeta(type) {
  return NOTIFICATION_TYPES[type] ?? NOTIFICATION_TYPES.SYSTEM
}

export function getColorStyles(type) {
  const meta = getTypeMeta(type)
  return COLOR_STYLES[meta.color]
}
