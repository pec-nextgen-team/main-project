import React from 'react'
import { Wallet } from 'lucide-react'
import { stockValueSummary } from '../../data/inventoryData.js'

const formatINR = (value) => `₹ ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function StockValueSummaryCard() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wallet size={16} className="text-green-600" />
        <h3 className="text-[13.5px] font-bold text-navy-900">Stock Value Summary</h3>
      </div>
      <dl className="space-y-2.5">
        <Row label="Total Stock Value" value={formatINR(stockValueSummary.total)} strong />
        <Row label="Consumable Items Value" value={formatINR(stockValueSummary.consumable)} />
        <Row label="Non-Consumable Items Value" value={formatINR(stockValueSummary.nonConsumable)} />
      </dl>
    </div>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-[12px] text-slate-600">{label}</dt>
      <dd className={`text-[12.5px] whitespace-nowrap ${strong ? 'font-bold text-navy-900' : 'font-medium text-navy-800'}`}>
        {value}
      </dd>
    </div>
  )
}
