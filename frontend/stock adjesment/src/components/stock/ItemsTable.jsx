import { Plus, Trash2 } from 'lucide-react'
import { CardHeading, TextInput } from '../form/FormControls'
import { formatINR } from '../../lib/formatCurrency'

export default function ItemsTable({ items, onUpdateItem, onAddItem, onRemoveItem }) {
  const totalItems = items.filter((it) => it.code).length
  const totalValue = items.reduce((sum, it) => sum + (it.qty || 0) * (it.unitPrice || 0), 0)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm sm:p-5">
      <CardHeading number="2" title="Items to Adjust" />

      <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[760px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border-subtle text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">
              <th className="w-10 py-2 pr-2">S.No.</th>
              <th className="py-2 pr-2">Item Code / Name</th>
              <th className="py-2 pr-2">Category</th>
              <th className="py-2 pr-2">Unit</th>
              <th className="py-2 pr-2 text-right">Current Stock</th>
              <th className="w-24 py-2 pr-2 text-right">Adj. Qty</th>
              <th className="w-28 py-2 pr-2 text-right">Unit Price (₹)</th>
              <th className="py-2 pr-2 text-right">Adj. Value (₹)</th>
              <th className="w-9 py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const value = (item.qty || 0) * (item.unitPrice || 0)
              const isEmpty = !item.code
              return (
                <tr key={item.id} className="border-b border-border-soft last:border-b-0">
                  <td className="py-2 pr-2 text-ink-400">{idx + 1}</td>
                  <td className="py-2 pr-2">
                    {isEmpty ? (
                      <TextInput
                        placeholder="Search item code or name…"
                        value={item.name}
                        onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                        className="min-w-[180px] py-1.5"
                      />
                    ) : (
                      <div>
                        <p className="font-semibold text-ink-800">{item.code}</p>
                        <p className="text-[12px] text-ink-500">{item.name}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-ink-600">{item.category || '—'}</td>
                  <td className="py-2 pr-2 text-ink-600">{item.unit || '—'}</td>
                  <td className="py-2 pr-2 text-right tabular-nums text-ink-600">
                    {isEmpty ? '—' : item.currentStock}
                  </td>
                  <td className="py-2 pr-2">
                    <TextInput
                      type="number"
                      min="0"
                      value={item.qty}
                      onChange={(e) => onUpdateItem(item.id, { qty: Number(e.target.value) })}
                      className="py-1.5 text-right tabular-nums"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <TextInput
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, { unitPrice: Number(e.target.value) })}
                      className="py-1.5 text-right tabular-nums"
                    />
                  </td>
                  <td className="py-2 pr-2 text-right font-semibold tabular-nums text-ink-800">
                    {isEmpty ? '—' : formatINR(value)}
                  </td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="rounded-md p-1.5 text-ink-300 hover:bg-danger-50 hover:text-danger-600"
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={onAddItem}
        className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" />
        Add Another Item
      </button>

      <div className="mt-4 flex flex-col items-end gap-1 border-t border-border-subtle pt-3">
        <p className="text-[13px] text-ink-500">
          Total Items: <span className="font-semibold text-ink-800">{totalItems}</span>
        </p>
        <p className="text-[14px] text-ink-700">
          Total Adjustment Value (₹):{' '}
          <span className="text-[16px] font-bold text-ink-900">{formatINR(totalValue)}</span>
        </p>
      </div>
    </div>
  )
}
