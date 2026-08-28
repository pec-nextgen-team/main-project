import { Paperclip, UploadCloud } from 'lucide-react'
import { Field, TextInput, SelectInput, TextArea, CardHeading } from '../form/FormControls'

export default function AdjustmentInfoCard({ form, onChange, fileName, onFileChange }) {
  const set = (key) => (e) => onChange(key, e.target.value)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm sm:p-5">
      <CardHeading number="1" title="Adjustment Information" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Adjustment No." required>
          <TextInput value={form.adjustmentNo} readOnly className="bg-app text-ink-500" />
        </Field>
        <Field label="Adjustment Date" required>
          <TextInput type="date" value={form.adjustmentDate} onChange={set('adjustmentDate')} />
        </Field>
        <Field label="Adjustment Type" required>
          <SelectInput value={form.adjustmentType} onChange={set('adjustmentType')}>
            <option>Damage</option>
            <option>Loss</option>
            <option>Expired</option>
            <option>Physical Stock Correction</option>
            <option>Return</option>
            <option>Other</option>
          </SelectInput>
        </Field>
        <Field label="Reference Type">
          <SelectInput value={form.referenceType} onChange={set('referenceType')}>
            <option value="">Select Reference</option>
            <option value="complaint">Complaint</option>
            <option value="purchase-order">Purchase Order</option>
            <option value="grn">Goods Receipt Note</option>
          </SelectInput>
        </Field>
        <Field label="Reference No.">
          <TextInput
            placeholder="Enter reference no."
            value={form.referenceNo}
            onChange={set('referenceNo')}
          />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Store / Location" required>
          <SelectInput value={form.storeLocation} onChange={set('storeLocation')}>
            <option>Main Store</option>
            <option>IT Lab Store</option>
            <option>Electrical Store</option>
          </SelectInput>
        </Field>
        <Field label="Department" required>
          <SelectInput value={form.department} onChange={set('department')}>
            <option>Electrical Maintenance</option>
            <option>Civil Maintenance</option>
            <option>IT & Networking</option>
          </SelectInput>
        </Field>
        <Field label="Adjusted By" required>
          <SelectInput value={form.adjustedBy} onChange={set('adjustedBy')}>
            <option>Mr. Selvaraj</option>
            <option>Mr. Prakash</option>
            <option>Mr. Kumar</option>
          </SelectInput>
        </Field>
        <Field label="Verified By" required>
          <SelectInput value={form.verifiedBy} onChange={set('verifiedBy')}>
            <option>Mr. Prakash</option>
            <option>Mr. Selvaraj</option>
            <option>Dr. Meena</option>
          </SelectInput>
        </Field>
        <Field label="Reason / Description" required className="sm:col-span-2 lg:col-span-1">
          <TextArea rows={2} value={form.reason} onChange={set('reason')} className="h-[74px]" />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Field label="Attachment (Optional)" hint="Upload photos / documents if any">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-subtle bg-app px-3 py-2 text-[13px] text-ink-500 hover:border-brand-300 hover:bg-brand-50/40">
            <UploadCloud className="h-4 w-4 shrink-0 text-ink-400" />
            <span className="truncate">{fileName || 'Choose file'}</span>
            <input type="file" className="hidden" onChange={onFileChange} />
            {fileName && <Paperclip className="ml-auto h-3.5 w-3.5 shrink-0 text-brand-600" />}
          </label>
        </Field>
        <Field label="Remarks">
          <TextArea rows={2} value={form.remarks} onChange={set('remarks')} placeholder="Optional notes" />
        </Field>
      </div>
    </div>
  )
}
