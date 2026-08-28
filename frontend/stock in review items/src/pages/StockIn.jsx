import { useMemo, useState } from 'react';
import {
  Calendar,
  Trash2,
  Plus,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  STORE_OPTIONS,
  SUPPLIER_OPTIONS,
  CATEGORY_OPTIONS,
  UNIT_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  TRANSPORT_OPTIONS,
  CONDITION_OPTIONS,
  buildInitialStockInForm,
  supplierInfo,
  stockInProcessSteps,
  existingInvoiceFile,
} from '../data/stockInSample.js';
import { SupplierInfoCard, StockInProcessCard, NotesCard } from '../components/StockInCards.jsx';
import FileUpload from '../components/FileUpload.jsx';
import { formatCurrency } from '../utils/currency.js';
import { submitStockIn } from '../api/stockApi.js';
import useAuth from '../hooks/useAuth.js';

function emptyItemRow() {
  return {
    id: `itm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemCode: '',
    category: '',
    unit: '',
    orderedQty: '',
    receivedQty: '',
    unitPrice: '',
    batch: '',
    expiryDate: '',
  };
}

function rowTotal(row) {
  const qty = Number(row.receivedQty) || 0;
  const price = Number(row.unitPrice) || 0;
  return qty * price;
}

export default function StockIn() {
  const { user } = useAuth('electricianHead');
  const [form, setForm] = useState(() => ({
    ...buildInitialStockInForm(),
    receivedBy: user.name,
  }));
  const [invoiceFile, setInvoiceFile] = useState(existingInvoiceFile);
  const [deliveryNoteFiles, setDeliveryNoteFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | draft | confirming | success | error
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const grandTotal = useMemo(() => form.items.reduce((sum, row) => sum + rowTotal(row), 0), [form.items]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function updateItem(id, field, value) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }));
  }

  function addItemRow() {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItemRow()] }));
  }

  function removeItemRow(id) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((row) => row.id !== id) : prev.items,
    }));
  }

  function validate() {
    const nextErrors = {};
    ['receiptNo', 'receiptDate', 'supplier', 'invoiceNo', 'invoiceDate', 'store', 'receivedBy'].forEach(
      (field) => {
        if (!String(form[field] || '').trim()) nextErrors[field] = 'Required';
      }
    );

    const itemErrors = form.items.map((row) => {
      const rowErr = {};
      if (!row.itemCode.trim()) rowErr.itemCode = true;
      if (!row.unit) rowErr.unit = true;
      if (!row.receivedQty || Number(row.receivedQty) <= 0) rowErr.receivedQty = true;
      return rowErr;
    });
    if (itemErrors.some((e) => Object.keys(e).length > 0)) nextErrors.items = itemErrors;
    if (!invoiceFile) nextErrors.invoiceFile = 'Invoice copy is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleCancel() {
    setForm({ ...buildInitialStockInForm(), receivedBy: user.name });
    setInvoiceFile(existingInvoiceFile);
    setDeliveryNoteFiles([]);
    setErrors({});
    setSubmitState('idle');
    setSubmitError('');
  }

  async function handleSaveDraft() {
    setSubmitState('draft');
    setSubmitError('');
    try {
      const files = [...(invoiceFile instanceof File ? [invoiceFile] : []), ...deliveryNoteFiles];
      const result = await submitStockIn({ ...form, grandTotal, status: 'DRAFT' }, files, true);
      setConfirmation({ ...result, isDraft: true });
      setSubmitState('success');
    } catch (err) {
      setSubmitState('error');
      setSubmitError(err.message || 'Could not save the draft.');
    }
  }

  async function handleConfirm(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitState('confirming');
    setSubmitError('');
    try {
      const files = [...(invoiceFile instanceof File ? [invoiceFile] : []), ...deliveryNoteFiles];
      const result = await submitStockIn({ ...form, grandTotal, status: 'CONFIRMED' }, files, false);
      setConfirmation({ ...result, isDraft: false });
      setSubmitState('success');
    } catch (err) {
      setSubmitState('error');
      setSubmitError(err.message || 'Could not confirm stock in.');
    }
  }

  if (submitState === 'success' && confirmation) {
    return <SuccessPanel confirmation={confirmation} onNew={handleCancel} />;
  }

  return (
    <div>
      {/* Page heading + breadcrumb */}
      <div className="mb-6">
        <nav className="mb-1 text-xs text-slate-500">
          <span>Home</span>
          <span className="mx-1.5">/</span>
          <span>Stock Management</span>
          <span className="mx-1.5">/</span>
          <span className="font-medium text-slate-700">Stock In</span>
        </nav>
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Stock In (Receive Items)</h2>
      </div>

      <form onSubmit={handleConfirm} noValidate>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-3">
            {/* 1. Purchase / Receipt Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <h3 className="mb-5 text-[15px] font-bold text-slate-800">1. Purchase / Receipt Information</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Receipt No." required error={errors.receiptNo}>
                  <TextInput value={form.receiptNo} onChange={(v) => updateField('receiptNo', v)} error={errors.receiptNo} />
                </Field>
                <Field label="Receipt Date" required error={errors.receiptDate}>
                  <DateInput value={form.receiptDate} onChange={(v) => updateField('receiptDate', v)} error={errors.receiptDate} />
                </Field>
                <Field label="PO / Purchase Order No.">
                  <TextInput value={form.poNo} onChange={(v) => updateField('poNo', v)} />
                </Field>
                <Field label="PO Date">
                  <DateInput value={form.poDate} onChange={(v) => updateField('poDate', v)} />
                </Field>

                <Field label="Supplier / Vendor" required error={errors.supplier}>
                  <Select
                    value={form.supplier}
                    onChange={(v) => updateField('supplier', v)}
                    options={SUPPLIER_OPTIONS}
                    placeholder="Select supplier"
                    error={errors.supplier}
                  />
                </Field>
                <Field label="Invoice No." required error={errors.invoiceNo}>
                  <TextInput value={form.invoiceNo} onChange={(v) => updateField('invoiceNo', v)} error={errors.invoiceNo} />
                </Field>
                <Field label="Invoice Date" required error={errors.invoiceDate}>
                  <DateInput value={form.invoiceDate} onChange={(v) => updateField('invoiceDate', v)} error={errors.invoiceDate} />
                </Field>
                <Field label="Challan / Delivery Note No.">
                  <TextInput value={form.challanNo} onChange={(v) => updateField('challanNo', v)} />
                </Field>

                <Field label="Store / Location" required error={errors.store}>
                  <Select
                    value={form.store}
                    onChange={(v) => updateField('store', v)}
                    options={STORE_OPTIONS}
                    placeholder="Select store"
                    error={errors.store}
                  />
                </Field>
                <Field label="Received By" required error={errors.receivedBy}>
                  <TextInput value={form.receivedBy} onChange={(v) => updateField('receivedBy', v)} error={errors.receivedBy} />
                </Field>
                <Field label="Remarks" className="sm:col-span-2 lg:col-span-2">
                  <TextInput value={form.remarks} onChange={(v) => updateField('remarks', v)} placeholder="Optional remarks" />
                </Field>
              </div>
            </div>

            {/* 2. Items Received */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <h3 className="mb-4 text-[15px] font-bold text-slate-800">2. Items Received</h3>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2.5">S.No.</th>
                      <th className="px-3 py-2.5">Item Code / Name *</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5">Unit *</th>
                      <th className="px-3 py-2.5">Ordered Qty</th>
                      <th className="px-3 py-2.5">Received Qty *</th>
                      <th className="px-3 py-2.5">Unit Price (₹)</th>
                      <th className="px-3 py-2.5">Batch / Lot No.</th>
                      <th className="px-3 py-2.5">Expiry Date</th>
                      <th className="px-3 py-2.5 text-right">Total (₹)</th>
                      <th className="px-3 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {form.items.map((row, index) => {
                      const rowErr = errors.items?.[index] || {};
                      return (
                        <tr key={row.id}>
                          <td className="px-3 py-2 text-slate-500">{index + 1}</td>
                          <td className="px-3 py-2">
                            <CellInput
                              value={row.itemCode}
                              onChange={(v) => updateItem(row.id, 'itemCode', v)}
                              placeholder="ITM-0000 - Item name"
                              error={rowErr.itemCode}
                              minWidth="min-w-[220px]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <CellSelect
                              value={row.category}
                              onChange={(v) => updateItem(row.id, 'category', v)}
                              options={CATEGORY_OPTIONS}
                              placeholder="-"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <CellSelect
                              value={row.unit}
                              onChange={(v) => updateItem(row.id, 'unit', v)}
                              options={UNIT_OPTIONS}
                              placeholder="-"
                              error={rowErr.unit}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <CellInput
                              type="number"
                              value={row.orderedQty}
                              onChange={(v) => updateItem(row.id, 'orderedQty', v)}
                              minWidth="min-w-[80px]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <CellInput
                              type="number"
                              value={row.receivedQty}
                              onChange={(v) => updateItem(row.id, 'receivedQty', v)}
                              error={rowErr.receivedQty}
                              minWidth="min-w-[90px]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <CellInput
                              type="number"
                              value={row.unitPrice}
                              onChange={(v) => updateItem(row.id, 'unitPrice', v)}
                              minWidth="min-w-[100px]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <CellInput
                              value={row.batch}
                              onChange={(v) => updateItem(row.id, 'batch', v)}
                              minWidth="min-w-[110px]"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              value={row.expiryDate}
                              onChange={(e) => updateItem(row.id, 'expiryDate', e.target.value)}
                              className="w-full min-w-[130px] rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-200"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-700 whitespace-nowrap">
                            {formatCurrency(rowTotal(row))}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItemRow(row.id)}
                              disabled={form.items.length === 1}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label={`Remove row ${index + 1}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addItemRow}
                className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <Plus className="h-4 w-4" />
                Add Another Item
              </button>

              <div className="mt-4 flex flex-col items-end gap-1 border-t border-slate-100 pt-4 text-sm">
                <p className="text-slate-500">
                  Total Items: <span className="font-semibold text-slate-700">{form.items.length}</span>
                </p>
                <p className="text-base">
                  Grand Total (₹):{' '}
                  <span className="text-lg font-extrabold text-brand-700">{formatCurrency(grandTotal)}</span>
                </p>
              </div>
            </div>

            {/* 3. Additional Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <h3 className="mb-5 text-[15px] font-bold text-slate-800">3. Additional Information</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Payment Terms">
                  <Select
                    value={form.paymentTerms}
                    onChange={(v) => updateField('paymentTerms', v)}
                    options={PAYMENT_TERMS_OPTIONS}
                    placeholder="Select"
                  />
                </Field>
                <Field label="Transport / Courier">
                  <Select
                    value={form.transportMode}
                    onChange={(v) => updateField('transportMode', v)}
                    options={TRANSPORT_OPTIONS}
                    placeholder="Select"
                  />
                </Field>
                <Field label="Transport Cost (₹)">
                  <TextInput
                    type="number"
                    value={form.transportCost}
                    onChange={(v) => updateField('transportCost', v)}
                  />
                </Field>
                <Field label="GRN / Gate Entry No.">
                  <TextInput value={form.grnNo} onChange={(v) => updateField('grnNo', v)} />
                </Field>
                <Field label="Received Condition">
                  <Select
                    value={form.receivedCondition}
                    onChange={(v) => updateField('receivedCondition', v)}
                    options={CONDITION_OPTIONS}
                    placeholder="Select"
                  />
                </Field>
                <Field label="Quality Verified By">
                  <TextInput
                    value={form.qualityVerifiedBy}
                    onChange={(v) => updateField('qualityVerifiedBy', v)}
                  />
                </Field>
              </div>

              {submitState === 'error' && (
                <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
              {errors.invoiceFile && (
                <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{errors.invoiceFile}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitState === 'draft' || submitState === 'confirming'}
                  className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={submitState === 'draft' || submitState === 'confirming'}
                  className="flex items-center justify-center gap-2 rounded-lg border border-brand-300 bg-brand-50 px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === 'draft' && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={submitState === 'draft' || submitState === 'confirming'}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === 'confirming' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Confirm Stock In
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <SupplierInfoCard supplier={supplierInfo} />
            <StockInProcessCard steps={stockInProcessSteps} />
            <NotesCard />

            {/* Upload Documents */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="mb-4 text-sm font-bold text-slate-800">Upload Documents</h3>

              <p className="mb-1.5 text-sm font-medium text-slate-700">
                Invoice Copy <span className="text-red-500">*</span>
              </p>
              {invoiceFile ? (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <span className="truncate text-sm text-slate-700">{invoiceFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInvoiceFile(null)}
                    className="ml-2 flex-shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                    aria-label="Remove invoice copy"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="mb-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500 hover:bg-slate-100">
                  <UploadCloud className="h-4 w-4 text-brand-500" />
                  Upload invoice copy
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => e.target.files?.[0] && setInvoiceFile(e.target.files[0])}
                  />
                </label>
              )}

              <p className="mb-1.5 text-sm font-medium text-slate-700">Delivery Note (Optional)</p>
              <FileUpload files={deliveryNoteFiles} onChange={setDeliveryNoteFiles} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, error, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2
        ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`}
    />
  );
}

function DateInput({ value, onChange, error }) {
  return (
    <div className="relative">
      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm text-slate-700 focus:outline-none focus:ring-2
          ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`}
      />
    </div>
  );
}

function Select({ value, onChange, options, placeholder, error }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none rounded-lg border bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2
        ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function CellInput({ value, onChange, placeholder, error, type = 'text', minWidth = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full ${minWidth} rounded-md border px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1
        ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'}`}
    />
  );
}

function CellSelect({ value, onChange, options, placeholder, error, minWidth = 'min-w-[110px]' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${minWidth} appearance-none rounded-md border bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>')] bg-[length:14px] bg-[right_8px_center] bg-no-repeat px-2 py-1.5 pr-7 text-sm text-slate-700 focus:outline-none focus:ring-1
        ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function SuccessPanel({ confirmation, onNew }) {
  const isDraft = confirmation.isDraft;
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
          isDraft ? 'bg-brand-100' : 'bg-emerald-100'
        }`}
      >
        <CheckCircle2 className={`h-8 w-8 ${isDraft ? 'text-brand-600' : 'text-emerald-600'}`} />
      </div>
      <h2 className="text-lg font-bold text-slate-800">
        {isDraft ? 'Draft Saved' : 'Stock In Confirmed'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Receipt <span className="font-semibold text-slate-700">{confirmation.receiptNo || confirmation.id}</span>{' '}
        {isDraft ? 'has been saved as a draft.' : 'has been confirmed and inventory will be updated.'}
      </p>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onNew}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Start a New Stock In
        </button>
      </div>
    </div>
  );
}
