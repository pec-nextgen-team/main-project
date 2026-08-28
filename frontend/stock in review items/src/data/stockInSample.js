/**
 * Sample data for the Stock In (Receive Items) page. In production this
 * would be seeded from the selected Purchase Order / Supplier record via
 * GET /api/stock/purchase-orders/:poNo (or similar) once the Express +
 * Prisma backend is connected — see api/stockApi.js.
 */

export const STORE_OPTIONS = ['Main Store', 'Block A Store', 'Electrical Store', 'Plumbing Store'];

export const SUPPLIER_OPTIONS = [
  'SUP-0021 - Sri Lakshmi Electricals',
  'SUP-0034 - Chennai Hardware Mart',
  'SUP-0045 - Anna Nagar Plumbing Supplies',
  'SUP-0058 - Precision Tools & Co.',
];

export const CATEGORY_OPTIONS = ['Electrical', 'Plumbing', 'Civil', 'IT / Networking', 'Other'];

export const UNIT_OPTIONS = ['Nos', 'Meter', 'Kg', 'Litre', 'Box'];

export const PAYMENT_TERMS_OPTIONS = ['Credit', 'Cash', 'Advance'];

export const TRANSPORT_OPTIONS = ['Lorry', 'Courier', 'Self Pickup'];

export const CONDITION_OPTIONS = ['Good', 'Damaged', 'Partial'];

export function buildInitialStockInForm() {
  return {
    receiptNo: 'RCPT-2026-00045',
    receiptDate: '2026-05-16',
    poNo: 'PO-2026-00215',
    poDate: '2026-05-14',
    supplier: SUPPLIER_OPTIONS[0],
    invoiceNo: 'INV-4587',
    invoiceDate: '2026-05-16',
    challanNo: 'DC-3321',
    store: 'Main Store',
    receivedBy: 'Mr. Selvaraj',
    remarks: '',
    paymentTerms: 'Credit',
    transportMode: 'Lorry',
    transportCost: '1200.00',
    grnNo: 'GRN-1125',
    receivedCondition: 'Good',
    qualityVerifiedBy: 'Mr. Prakash',
    items: [
      {
        id: 'itm-1',
        itemCode: 'ITM-0001 - LED Tube Light 20W',
        category: 'Electrical',
        unit: 'Nos',
        orderedQty: '100',
        receivedQty: '100',
        unitPrice: '350.00',
        batch: 'BAT-5567',
        expiryDate: '',
      },
      {
        id: 'itm-2',
        itemCode: 'ITM-0002 - MCB 16A',
        category: 'Electrical',
        unit: 'Nos',
        orderedQty: '50',
        receivedQty: '50',
        unitPrice: '245.00',
        batch: 'BAT-5568',
        expiryDate: '',
      },
      {
        id: 'itm-3',
        itemCode: 'ITM-0003 - PVC Pipe 1 inch',
        category: 'Plumbing',
        unit: 'Meter',
        orderedQty: '200',
        receivedQty: '200',
        unitPrice: '45.00',
        batch: 'BAT-5569',
        expiryDate: '',
      },
      {
        id: 'itm-4',
        itemCode: 'ITM-0004 - GI Wire 1.5 sq.mm',
        category: 'Electrical',
        unit: 'Meter',
        orderedQty: '300',
        receivedQty: '300',
        unitPrice: '25.00',
        batch: 'BAT-5570',
        expiryDate: '',
      },
    ],
  };
}

export const supplierInfo = {
  name: 'Sri Lakshmi Electricals',
  contact: 'Mr. Ramesh',
  phone: '98400 11223',
  email: 'sales@slakshmi.com',
  address: '12, Anna Salai, Chennai - 600002',
};

export const stockInProcessSteps = [
  { label: 'Purchase Order Created', date: '14-05-2026', state: 'done' },
  { label: 'Goods Received', date: '16-05-2026', state: 'done' },
  { label: 'Stock In (Receive)', date: null, state: 'current' },
  { label: 'Inventory Updated', date: null, state: 'upcoming' },
  { label: 'Notification Sent', date: null, state: 'upcoming' },
];

export const existingInvoiceFile = { name: 'Invoice_4587.pdf', size: 428000 };
