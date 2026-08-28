import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function DonutChart({ data, centerValue, centerLabel, size = 180 }) {
  return (
    <div className="relative" style={{ width: '100%', height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {centerValue !== undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl font-extrabold text-navy-900 leading-none">{centerValue}</p>
          <p className="text-[10.5px] text-slate-400 mt-1">{centerLabel}</p>
        </div>
      )}
    </div>
  )
}
