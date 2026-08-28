import { TrendingDown, TrendingUp } from 'lucide-react'
import { Field, SelectInput, TextArea, CardHeading } from '../form/FormControls'

const INCREASE_TYPES = new Set(['Return'])

export default function AdditionalInfoCard({ form, onChange, onCancel, onSaveDraft, onConfirm }) {
  const set = (key) => (e) => onChange(key, e.target.value)
  const isIncrease = INCREASE_TYPES.has(form.adjustmentType)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm sm:p-5">
      <CardHeading number="3" title="Additional Information" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[12.5px] font-semibold text-ink-600">Adjustment Impact</p>
          {isIncrease ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-success-50 px-2.5 py-1 text-[12.5px] font-semibold text-success-700 ring-1 ring-inset ring-success-100">
              <TrendingUp className="h-3.5 w-3.5" />
              Increase Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-danger-50 px-2.5 py-1 text-[12.5px] font-semibold text-danger-700 ring-1 ring-inset ring-danger-100">
              <TrendingDown className="h-3.5 w-3.5" />
              Decrease Stock
            </span>
          )}
        </div>
        <div>
          <p className="mb-1.5 text-[12.5px] font-semibold text-ink-600">Affects Stock Value</p>
          <span className="inline-flex items-center rounded-md bg-success-50 px-2.5 py-1 text-[12.5px] font-semibold text-success-700 ring-1 ring-inset ring-success-100">
            Yes
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Accounting Head">
          <SelectInput value={form.accountingHead} onChange={set('accountingHead')}>
            <option>Maintenance Expense</option>
            <option>Inventory Write-off</option>
            <option>Capital Asset</option>
          </SelectInput>
        </Field>
        <Field label="Approved By (Optional)">
          <SelectInput value={form.approvedBy} onChange={set('approvedBy')}>
            <option>Mr. Selvaraj</option>
            <option>Mr. Prakash</option>
            <option>Dr. Meena</option>
          </SelectInput>
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Approval Remarks (Optional)">
          <TextArea rows={2} value={form.approvalRemarks} onChange={set('approvalRemarks')} placeholder="Optional remarks" />
        </Field>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border-subtle px-4 py-2 text-[13.5px] font-semibold text-ink-600 hover:bg-app"
        >
          Cancel
        </button>
        <button
          onClick={onSaveDraft}
          className="rounded-lg border border-border-subtle bg-app px-4 py-2 text-[13.5px] font-semibold text-ink-700 hover:bg-border-soft"
        >
          Save as Draft
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-success-600 px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-success-700"
        >
          Confirm Adjustment
        </button>
      </div>
    </div>
  )
}
