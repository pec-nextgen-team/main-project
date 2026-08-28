// Mock data for /stock-management/inventory
// Later this should be replaced by: GET /api/inventory

export const inventorySummary = [
  { id: 'total-items', icon: 'Package', number: '256', title: 'Total Items', subtitle: 'All Items', color: 'blue' },
  { id: 'total-value', icon: 'IndianRupee', number: '₹ 4,58,230', title: 'Total Stock Value', subtitle: 'All Items', color: 'green' },
  { id: 'low-stock', icon: 'AlertTriangle', number: '18', title: 'Low Stock Items', subtitle: 'Reorder Soon', color: 'orange' },
  { id: 'out-of-stock', icon: 'PackageX', number: '6', title: 'Out of Stock Items', subtitle: 'Need Attention', color: 'red' },
  { id: 'expiring-soon', icon: 'CalendarClock', number: '12', title: 'Expiring Soon', subtitle: 'Within 90 Days', color: 'purple' },
  { id: 'suppliers', icon: 'Truck', number: '24', title: 'Suppliers', subtitle: 'Active Suppliers', color: 'teal' },
]

export const categoryOptions = ['All Categories', 'Electrical', 'Plumbing', 'General']

export const subCategoryOptions = {
  'All Categories': ['All Sub Categories'],
  Electrical: ['All Sub Categories', 'Lighting', 'Wiring', 'Switchgear'],
  Plumbing: ['All Sub Categories', 'Pipes', 'Fittings'],
  General: ['All Sub Categories', 'Hardware', 'Consumables'],
}

export const locationOptions = ['All Locations', 'Main Store', 'Plumbing Store']

export const statusOptions = ['All Status', 'Active', 'Inactive']

export const stockStatusOptions = ['All Stock Status', 'In Stock', 'Low Stock', 'Out of Stock']

export const inventoryItems = [
  {
    id: 1,
    itemCode: 'ITM-0001',
    itemName: 'LED Tube Light 20W',
    category: 'Electrical',
    unit: 'Nos',
    location: 'Main Store',
    openingStock: 120,
    availableStock: 86,
    unitPrice: 350.0,
    status: 'In Stock',
  },
  {
    id: 2,
    itemCode: 'ITM-0002',
    itemName: 'MCB 16A',
    category: 'Electrical',
    unit: 'Nos',
    location: 'Main Store',
    openingStock: 60,
    availableStock: 12,
    unitPrice: 245.0,
    status: 'Low Stock',
    reorderLevel: 20,
  },
  {
    id: 3,
    itemCode: 'ITM-0003',
    itemName: 'PVC Pipe 1 inch',
    category: 'Plumbing',
    unit: 'Meter',
    location: 'Plumbing Store',
    openingStock: 200,
    availableStock: 0,
    unitPrice: 45.0,
    status: 'Out of Stock',
  },
  {
    id: 4,
    itemCode: 'ITM-0004',
    itemName: 'GI Wire 1.5 sq.mm',
    category: 'Electrical',
    unit: 'Meter',
    location: 'Main Store',
    openingStock: 500,
    availableStock: 210,
    unitPrice: 25.0,
    status: 'In Stock',
  },
  {
    id: 5,
    itemCode: 'ITM-0005',
    itemName: 'Screw 1 inch',
    category: 'General',
    unit: 'Packet',
    location: 'Main Store',
    openingStock: 80,
    availableStock: 6,
    unitPrice: 15.0,
    status: 'Low Stock',
    reorderLevel: 15,
  },
  {
    id: 6,
    itemCode: 'ITM-0006',
    itemName: 'CPVC Elbow 1 inch',
    category: 'Plumbing',
    unit: 'Nos',
    location: 'Plumbing Store',
    openingStock: 150,
    availableStock: 35,
    unitPrice: 28.0,
    status: 'In Stock',
  },
  {
    id: 7,
    itemCode: 'ITM-0007',
    itemName: 'Electrical Tape',
    category: 'Electrical',
    unit: 'Roll',
    location: 'Main Store',
    openingStock: 100,
    availableStock: 0,
    unitPrice: 18.0,
    status: 'Out of Stock',
  },
  {
    id: 8,
    itemCode: 'ITM-0008',
    itemName: 'Paint Brush 2 inch',
    category: 'General',
    unit: 'Nos',
    location: 'Main Store',
    openingStock: 50,
    availableStock: 18,
    unitPrice: 35.0,
    status: 'Low Stock',
    reorderLevel: 25,
  },
]

export const stockStatusDonut = [
  { name: 'In Stock', value: 152, color: '#16a34a' },
  { name: 'Low Stock', value: 18, color: '#f97316' },
  { name: 'Out of Stock', value: 6, color: '#dc2626' },
  { name: 'Expiring Soon', value: 12, color: '#9333ea' },
  { name: 'Others', value: 68, color: '#94a3b8' },
]

export const categoryDonut = [
  { name: 'Electrical', value: 142, color: '#2563eb' },
  { name: 'Plumbing', value: 56, color: '#0891b2' },
  { name: 'General', value: 38, color: '#f97316' },
  { name: 'Others', value: 20, color: '#94a3b8' },
]

export const stockValueSummary = {
  total: 458230,
  consumable: 235420,
  nonConsumable: 222810,
}

export const recentTransactions = [
  { id: 1, type: 'Stock In', itemCode: 'ITM-0001', date: '16-05-2026' },
  { id: 2, type: 'Stock Out', itemCode: 'ITM-0002', date: '16-05-2026' },
  { id: 3, type: 'Stock In', itemCode: 'ITM-0004', date: '15-05-2026' },
  { id: 4, type: 'Stock Out', itemCode: 'ITM-0005', date: '15-05-2026' },
  { id: 5, type: 'Adjustment', itemCode: 'ITM-0003', date: '14-05-2026' },
]

export const topLowStockItems = [
  { itemCode: 'ITM-0002', itemName: 'MCB 16A', availableStock: 12, reorderLevel: 20 },
  { itemCode: 'ITM-0005', itemName: 'Screw 1 inch', availableStock: 6, reorderLevel: 15 },
  { itemCode: 'ITM-0008', itemName: 'Paint Brush 2 inch', availableStock: 18, reorderLevel: 25 },
]
