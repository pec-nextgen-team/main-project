import React, { useEffect, useState } from 'react'
import { X, Save } from 'lucide-react'
import FormInput from '../FormInput.jsx'
import FormSelect from '../FormSelect.jsx'
import { categoryOptions, locationOptions } from '../../data/inventoryData.js'

const UNIT_OPTIONS = ['Nos', 'Meter', 'Packet', 'Roll', 'Litre', 'Kg']

const EMPTY_ITEM = {
  itemName: '',
  category: '',
  unit: '',
  location: '',
  openingStock: '',
  availableStock: '',
  unitPrice: '',
}

export default function ItemFormModal({ open, item, nextItemCode, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_ITEM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              itemName: item.itemName,
              category: item.category,
              unit: item.unit,
              location: item.location,
              openingStock: String(item.openingStock),
              availableStock: String(item.availableStock),
              unitPrice: String(item.unitPrice),
            }
          : EMPTY_ITEM
      )
      setErrors({})
    }
  }, [open, item])

  if (!open) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const required = ['itemName', 'category', 'unit', 'location', 'openingStock', 'availableStock', 'unitPrice']
    const nextErrors = {}
    required.forEach((field) => {
      if (!String(form[field]).trim()) nextErrors[field] = 'Required'
    })
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSave({
      ...form,
      openingStock: Number(form.openingStock),
      availableStock: Number(form.availableStock),
      unitPrice: Number(form.unitPrice),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl">
          <h3 className="text-[15px] font-bold text-navy-900">
            {item ? 'Edit Item' : 'Add Item'}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <FormInput label="Item Code" value={item ? item.itemCode : nextItemCode} disabled hint="Auto generated" />
          <FormInput
            label="Item Name"
            required
            placeholder="Enter item name"
            value={form.itemName}
            onChange={set('itemName')}
            error={errors.itemName}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              required
              placeholder="Select Category"
              options={categoryOptions.filter((c) => c !== 'All Categories')}
              value={form.category}
              onChange={set('category')}
              error={errors.category}
            />
            <FormSelect
              label="Unit"
              required
              placeholder="Select Unit"
              options={UNIT_OPTIONS}
              value={form.unit}
              onChange={set('unit')}
              error={errors.unit}
            />
          </div>
          <FormSelect
            label="Location / Store"
            required
            placeholder="Select Location"
            options={locationOptions.filter((l) => l !== 'All Locations')}
            value={form.location}
            onChange={set('location')}
            error={errors.location}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Opening Stock"
              required
              type="number"
              min="0"
              value={form.openingStock}
              onChange={set('openingStock')}
              error={errors.openingStock}
            />
            <FormInput
              label="Available Stock"
              required
              type="number"
              min="0"
              value={form.availableStock}
              onChange={set('availableStock')}
              error={errors.availableStock}
            />
            <FormInput
              label="Unit Price (₹)"
              required
              type="number"
              min="0"
              step="0.01"
              value={form.unitPrice}
              onChange={set('unitPrice')}
              error={errors.unitPrice}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-md bg-brand-blue text-white hover:bg-blue-700"
          >
            <Save size={14} />
            {item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  )
}
