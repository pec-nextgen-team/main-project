import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { specializationOptions } from '../data/electricianOptions.js'

export default function SpecializationCheckboxes({ selected, onChange, error }) {
  const [showOther, setShowOther] = useState(false)
  const [otherValue, setOtherValue] = useState('')

  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  const addOther = () => {
    const trimmed = otherValue.trim()
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed])
    }
    setOtherValue('')
    setShowOther(false)
  }

  return (
    <div>
      <label className="block text-[13.5px] font-medium text-navy-800 mb-2.5">
        Specialization<span className="text-red-500 ml-0.5">*</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
        {specializationOptions
          .filter((o) => o !== 'Other')
          .map((option) => (
            <label key={option} className="flex items-center gap-2 text-[13px] text-navy-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue/30"
              />
              {option}
            </label>
          ))}

        {selected
          .filter((s) => !specializationOptions.includes(s))
          .map((custom) => (
            <label key={custom} className="flex items-center gap-2 text-[13px] text-navy-700 cursor-pointer">
              <input
                type="checkbox"
                checked
                onChange={() => toggle(custom)}
                className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue/30"
              />
              {custom}
            </label>
          ))}
      </div>

      <div className="mt-3">
        {showOther ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOther())}
              placeholder="Type specialization"
              className="text-[13px] border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
            <button
              type="button"
              onClick={addOther}
              className="text-[12.5px] font-medium text-brand-blue hover:underline"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOther(false)
                setOtherValue('')
              }}
              className="text-[12.5px] text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowOther(true)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-blue hover:underline"
          >
            <Plus size={13} />
            Enter other specialization
          </button>
        )}
      </div>

      {error && <p className="text-[11.5px] text-red-600 mt-2">{error}</p>}
    </div>
  )
}
