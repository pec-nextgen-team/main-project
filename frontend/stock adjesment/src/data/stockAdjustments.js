import { AlertTriangle, PackageX, CalendarClock, ClipboardCheck, RotateCcw, MoreHorizontal } from 'lucide-react'

export const ADJUSTMENT_TYPES = [
  { id: 'damage', label: 'Damage', description: 'Items damaged / defective', icon: AlertTriangle, color: 'danger' },
  { id: 'loss', label: 'Loss', description: 'Items lost / missing', icon: PackageX, color: 'warning' },
  { id: 'expired', label: 'Expired', description: 'Items expired', icon: CalendarClock, color: 'ink' },
  { id: 'correction', label: 'Physical Stock Correction', description: 'Quantity correction after physical count', icon: ClipboardCheck, color: 'info' },
  { id: 'return', label: 'Return', description: 'Items returned to stock', icon: RotateCcw, color: 'success' },
  { id: 'other', label: 'Other', description: 'Other adjustments', icon: MoreHorizontal, color: 'violet' },
]

export const seedItems = [
  {
    id: 'row_1',
    code: 'ITM-0002',
    name: 'MCB 16A',
    category: 'Electrical',
    unit: 'Nos',
    currentStock: 12,
    qty: 1,
    unitPrice: 245.0,
  },
  {
    id: 'row_2',
    code: 'ITM-0005',
    name: 'Screw 1 inch',
    category: 'General',
    unit: 'Packet',
    currentStock: 6,
    qty: 2,
    unitPrice: 90.0,
  },
  {
    id: 'row_3',
    code: 'ITM-0006',
    name: 'Electrical Tape',
    category: 'Electrical',
    unit: 'Roll',
    currentStock: 18,
    qty: 1,
    unitPrice: 18.0,
  },
]

export const stockSummary = {
  totalItems: 256,
  inStock: 198,
  lowStock: 18,
  outOfStock: 6,
  expiringSoon: 12,
}

export const recentAdjustments = [
  { id: 'ADJ-2026-00044', date: '15-05-2026', type: 'Damage', value: 1250.0 },
  { id: 'ADJ-2026-00043', date: '14-05-2026', type: 'Physical Correction', value: -320.0 },
  { id: 'ADJ-2026-00042', date: '13-05-2026', type: 'Expired', value: 180.0 },
]

export const adjustmentInfoDefaults = {
  adjustmentNo: 'ADJ-2026-00045',
  adjustmentDate: '2026-05-16',
  adjustmentType: 'Damage',
  referenceType: '',
  referenceNo: '',
  storeLocation: 'Main Store',
  department: 'Electrical Maintenance',
  adjustedBy: 'Mr. Selvaraj',
  verifiedBy: 'Mr. Prakash',
  reason: 'MCB damaged during previous repair work inspection on 15-05-2026.',
  remarks: '',
  approvedBy: 'Mr. Selvaraj',
  approvalRemarks: '',
  accountingHead: 'Maintenance Expense',
}
