import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import AdjustmentInfoCard from '../components/stock/AdjustmentInfoCard'
import ItemsTable from '../components/stock/ItemsTable'
import AdditionalInfoCard from '../components/stock/AdditionalInfoCard'
import AdjustmentTypesCard from '../components/stock/AdjustmentTypesCard'
import StockSummaryCard from '../components/stock/StockSummaryCard'
import RecentAdjustmentsCard from '../components/stock/RecentAdjustmentsCard'
import NoteCard from '../components/NoteCard'
import { adjustmentInfoDefaults, ADJUSTMENT_TYPES } from '../data/stockAdjustments'
import { fetchStockSummary, fetchRecentAdjustments, submitAdjustment } from '../services/stockAdjustmentService'

let rowSeq = 0
const emptyRow = () => ({
  id: `new_${++rowSeq}`,
  code: '',
  name: '',
  category: '',
  unit: '',
  currentStock: 0,
  qty: 0,
  unitPrice: 0,
})

const NOTES = [
  'Adjustments will affect available stock.',
  'Ensure correct quantity and reason.',
  'Attach proof if required.',
  'Verified adjustments cannot be edited.',
]

export default function StockAdjustmentsPage() {
  const [form, setForm] = useState(adjustmentInfoDefaults)
  const [items, setItems] = useState(() => [emptyRow()])
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('success')

  const [stockSummary, setStockSummary] = useState(null)
  const [recentAdjustments, setRecentAdjustments] = useState([])
  const [summaryError, setSummaryError] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedTypeId = ADJUSTMENT_TYPES.find((t) => t.label === form.adjustmentType)?.id ?? 'damage'
  const setSelectedTypeId = (id) => {
    const type = ADJUSTMENT_TYPES.find((t) => t.id === id)
    if (type) setForm((prev) => ({ ...prev, adjustmentType: type.label }))
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToastType(type)
    setToast(message)
  }

  const loadSidebarData = async () => {
    setSummaryError('')
    try {
      const [summary, recent] = await Promise.all([fetchStockSummary(), fetchRecentAdjustments()])
      setStockSummary(summary)
      setRecentAdjustments(Array.isArray(recent) ? recent : [])
    } catch (err) {
      setSummaryError(err.message || 'Failed to load stock summary.')
    }
  }

  useEffect(() => {
    loadSidebarData()
  }, [])

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const updateItem = (id, patch) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const addItem = () => setItems((prev) => [...prev, emptyRow()])

  const removeItem = (id) => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev))

  const resetForm = () => {
    setForm(adjustmentInfoDefaults)
    setItems([emptyRow()])
    setFileName('')
    setFile(null)
  }

  const handleCancel = () => {
    resetForm()
    showToast('Adjustment cancelled')
  }

  const submit = async (isDraft) => {
    setSaving(true)
    try {
      const payload = { ...form, items: items.filter((it) => it.code || it.name) }
      const result = await submitAdjustment(payload, isDraft)
      showToast(isDraft ? 'Saved as draft' : 'Adjustment confirmed')
      if (!isDraft) resetForm()
      await loadSidebarData()
      return result
    } catch (err) {
      showToast(err.message || 'Could not save the adjustment.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Stock Adjustments"
        crumbs={[{ label: 'Home', path: '/' }, { label: 'Stock Management' }, { label: 'Adjustments' }]}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <AdjustmentInfoCard
            form={form}
            onChange={updateForm}
            fileName={fileName}
            onFileChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setFile(f)
              setFileName(f?.name ?? '')
            }}
          />

          <ItemsTable items={items} onUpdateItem={updateItem} onAddItem={addItem} onRemoveItem={removeItem} />

          <AdditionalInfoCard
            form={form}
            onChange={updateForm}
            onCancel={handleCancel}
            onSaveDraft={() => submit(true)}
            onConfirm={() => submit(false)}
            saving={saving}
          />
        </div>

        <div className="space-y-4">
          <AdjustmentTypesCard selected={selectedTypeId} onSelect={setSelectedTypeId} />
          {summaryError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {summaryError}
            </div>
          ) : (
            stockSummary && <StockSummaryCard summary={stockSummary} />
          )}
          <NoteCard title="Notes" notes={NOTES} tone="warning" />
          <RecentAdjustmentsCard adjustments={recentAdjustments} onViewAll={() => showToast('Opening all adjustments…')} />
        </div>
      </div>

      <Toast message={toast} type={toastType} onClose={() => setToast('')} />
    </>
  )
}
