import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Plus, PackagePlus, PackageMinus, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import Pagination from '../components/Pagination.jsx'
import Toast from '../components/Toast.jsx'
import InventoryFilterPanel from '../components/inventory/InventoryFilterPanel.jsx'
import InventoryTable from '../components/inventory/InventoryTable.jsx'
import ItemFormModal from '../components/inventory/ItemFormModal.jsx'
import ViewItemModal from '../components/inventory/ViewItemModal.jsx'
import DeleteConfirmModal from '../components/inventory/DeleteConfirmModal.jsx'
import StockMovementModal from '../components/inventory/StockMovementModal.jsx'
import StockStatusSummaryCard from '../components/inventory/StockStatusSummaryCard.jsx'
import StockValueSummaryCard from '../components/inventory/StockValueSummaryCard.jsx'
import RecentTransactionsCard from '../components/inventory/RecentTransactionsCard.jsx'
import TopLowStockItemsCard from '../components/inventory/TopLowStockItemsCard.jsx'
import TopCategoriesCard from '../components/inventory/TopCategoriesCard.jsx'
import QuickActionsCard from '../components/inventory/QuickActionsCard.jsx'
import NotesCard from '../components/inventory/NotesCard.jsx'
import { categoryOptions, subCategoryOptions, locationOptions, statusOptions, stockStatusOptions } from '../data/inventoryData.js'
import { fetchInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, recordStockMovement } from '../services/inventoryService.js'

const INITIAL_FILTERS = {
  search: '',
  category: 'All Categories',
  subCategory: 'All Sub Categories',
  location: 'All Locations',
  status: 'All Status',
  stockStatus: 'All Stock Status',
  fromValue: '',
  toValue: '',
}

function nextItemCode(items) {
  const max = items.reduce((m, i) => {
    const n = Number(String(i.itemCode || '').replace('ITM-', ''))
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return `ITM-${String(max + 1).padStart(4, '0')}`
}

export default function Inventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState([])
  const [toast, setToast] = useState(null)
  const [savingItem, setSavingItem] = useState(false)
  const [deletingItem, setDeletingItem] = useState(false)
  const [submittingMovement, setSubmittingMovement] = useState(false)

  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [movementMode, setMovementMode] = useState(null) // 'in' | 'out' | 'adjustment' | null
  const [movementItem, setMovementItem] = useState(null)

  const loadInventory = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await fetchInventory(filters)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setLoadError(err.message || 'Failed to load inventory.')
      setToast({ type: 'error', title: 'Could not load inventory', message: err.message })
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.location, filters.stockStatus, filters.search])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const inventorySummary = useMemo(() => {
    const totalItems = items.length
    const totalValue = items.reduce((sum, i) => sum + (i.availableStock || 0) * (i.unitPrice || 0), 0)
    const lowStock = items.filter((i) => i.status === 'Low Stock').length
    const outOfStock = items.filter((i) => i.status === 'Out of Stock').length
    return [
      { id: 'total-items', icon: 'Package', number: String(totalItems), title: 'Total Items', subtitle: 'All Items', color: 'blue' },
      { id: 'total-value', icon: 'IndianRupee', number: `₹ ${totalValue.toLocaleString('en-IN')}`, title: 'Total Stock Value', subtitle: 'All Items', color: 'green' },
      { id: 'low-stock', icon: 'AlertTriangle', number: String(lowStock), title: 'Low Stock Items', subtitle: 'Reorder Soon', color: 'orange' },
      { id: 'out-of-stock', icon: 'PackageX', number: String(outOfStock), title: 'Out of Stock Items', subtitle: 'Need Attention', color: 'red' },
    ]
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const term = filters.search.trim().toLowerCase()
      if (term && !(item.itemCode?.toLowerCase().includes(term) || item.itemName?.toLowerCase().includes(term))) {
        return false
      }
      if (filters.category !== 'All Categories' && item.category !== filters.category) return false
      if (filters.location !== 'All Locations' && item.location !== filters.location) return false
      if (filters.stockStatus !== 'All Stock Status' && item.status !== filters.stockStatus) return false

      const value = (item.availableStock || 0) * (item.unitPrice || 0)
      if (filters.fromValue && value < Number(filters.fromValue)) return false
      if (filters.toValue && value > Number(filters.toValue)) return false

      return true
    })
  }, [items, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleFilterChange = (next) => {
    setFilters(next)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
  }

  const handleExport = () => {
    const headers = ['Item Code', 'Item Name', 'Category', 'Unit', 'Location', 'Opening Stock', 'Available Stock', 'Unit Price', 'Stock Value', 'Status']
    const rows = filtered.map((i) => [
      i.itemCode,
      i.itemName,
      i.category,
      i.unit,
      i.location,
      i.openingStock,
      i.availableStock,
      Number(i.unitPrice || 0).toFixed(2),
      (Number(i.availableStock || 0) * Number(i.unitPrice || 0)).toFixed(2),
      i.status,
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'inventory.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    const pageIds = pagedItems.map((i) => i.id)
    const allSelected = pageIds.every((id) => selectedIds.includes(id))
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !pageIds.includes(id)) : [...new Set([...prev, ...pageIds])]
    )
  }

  const handleSaveItem = async (formValues) => {
    setSavingItem(true)
    try {
      if (editItem) {
        const updated = await updateInventoryItem(editItem.id, formValues)
        setItems((prev) => prev.map((i) => (i.id === editItem.id ? updated : i)))
        setToast({ type: 'success', title: 'Item updated', message: `${updated.itemName} has been updated.` })
        setEditItem(null)
      } else {
        const created = await createInventoryItem(formValues)
        setItems((prev) => [created, ...prev])
        setToast({ type: 'success', title: 'Item added', message: `${created.itemName} has been added to inventory.` })
        setShowAddModal(false)
      }
    } catch (err) {
      setToast({ type: 'error', title: 'Save failed', message: err.message })
    } finally {
      setSavingItem(false)
    }
  }

  const handleDeleteConfirm = async (item) => {
    setDeletingItem(true)
    try {
      await deleteInventoryItem(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      setSelectedIds((prev) => prev.filter((id) => id !== item.id))
      setToast({ type: 'success', title: 'Item deleted', message: `${item.itemName} was removed from inventory.` })
    } catch (err) {
      setToast({ type: 'error', title: 'Delete failed', message: err.message })
    } finally {
      setDeletingItem(false)
      setDeleteItem(null)
    }
  }

  const handleStockMovement = async ({ itemId, quantity, mode }) => {
    setSubmittingMovement(true)
    try {
      const updated = await recordStockMovement(itemId, mode, quantity)
      setItems((prev) => prev.map((i) => (String(i.id) === String(itemId) ? updated : i)))
      const labels = { in: 'Stock In recorded', out: 'Stock Out recorded', adjustment: 'Stock adjusted' }
      setToast({ type: 'success', title: labels[mode] })
      setMovementMode(null)
      setMovementItem(null)
    } catch (err) {
      setToast({ type: 'error', title: 'Stock movement failed', message: err.message })
    } finally {
      setSubmittingMovement(false)
    }
  }

  return (
    <div>
      <PageHeader title="Stock Management" breadcrumbItems={['Home', 'Stock Management', 'Inventory']} icon="stock" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-5">
        {inventorySummary.map((stat) => (
          <SummaryCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div>
          <InventoryFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            onExport={handleExport}
          />

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-navy-900">Inventory List</h3>
            <div className="flex items-center gap-2">
              <ActionBtn icon={Plus} label="Add Item" onClick={() => setShowAddModal(true)} primary />
              <ActionBtn icon={PackagePlus} label="Stock In" onClick={() => setMovementMode('in')} />
              <ActionBtn icon={PackageMinus} label="Stock Out" onClick={() => setMovementMode('out')} />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-16 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading inventory…
            </div>
          ) : loadError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
              <button type="button" onClick={loadInventory} className="ml-3 font-semibold underline">
                Retry
              </button>
            </div>
          ) : (
            <>
              <InventoryTable
                items={pagedItems}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onView={setViewItem}
                onEdit={setEditItem}
                onDelete={setDeleteItem}
              />

              <Pagination
                totalRecords={filtered.length}
                pageSize={pageSize}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                }}
              />
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            <TopLowStockItemsCard />
            <TopCategoriesCard />
          </div>
        </div>

        <div className="space-y-4">
          <StockStatusSummaryCard />
          <StockValueSummaryCard />
          <RecentTransactionsCard />
          <QuickActionsCard
            onAddItem={() => setShowAddModal(true)}
            onStockIn={() => setMovementMode('in')}
            onStockOut={() => setMovementMode('out')}
            onAdjustment={() => setMovementMode('adjustment')}
            onViewReport={() => setToast({ type: 'success', title: 'Opening stock report…' })}
          />
          <NotesCard />
        </div>
      </div>

      <ItemFormModal
        open={showAddModal || !!editItem}
        item={editItem}
        nextItemCode={nextItemCode(items)}
        saving={savingItem}
        onClose={() => {
          setShowAddModal(false)
          setEditItem(null)
        }}
        onSave={handleSaveItem}
      />

      <ViewItemModal item={viewItem} onClose={() => setViewItem(null)} />

      <DeleteConfirmModal
        item={deleteItem}
        deleting={deletingItem}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
      />

      <StockMovementModal
        mode={movementMode}
        item={movementItem}
        items={items}
        submitting={submittingMovement}
        onClose={() => {
          setMovementMode(null)
          setMovementItem(null)
        }}
        onSubmit={handleStockMovement}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, primary }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-medium rounded-md transition-colors ${
        primary
          ? 'bg-brand-blue text-white hover:bg-blue-700'
          : 'border border-slate-200 text-navy-700 hover:bg-slate-50'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
