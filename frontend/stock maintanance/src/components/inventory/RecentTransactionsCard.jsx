import React from 'react'
import { ArrowDownCircle, ArrowUpCircle, SlidersHorizontal } from 'lucide-react'
import { recentTransactions } from '../../data/inventoryData.js'

const TYPE_CONFIG = {
  'Stock In': { icon: ArrowDownCircle, color: 'text-green-600' },
  'Stock Out': { icon: ArrowUpCircle, color: 'text-orange-600' },
  Adjustment: { icon: SlidersHorizontal, color: 'text-purple-600' },
}

export default function RecentTransactionsCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-3">Recent Transactions</h3>
      <ul className="space-y-3">
        {recentTransactions.map((tx) => {
          const cfg = TYPE_CONFIG[tx.type]
          const Icon = cfg.icon
          return (
            <li key={tx.id} className="flex items-start gap-2.5">
              <Icon size={16} className={`${cfg.color} shrink-0 mt-0.5`} />
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-navy-800">
                  {tx.type} - {tx.itemCode}
                </p>
                <p className="text-[11px] text-slate-400">{tx.date}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
