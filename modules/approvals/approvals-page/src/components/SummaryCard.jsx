const THEMES = {
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    iconBg: "bg-orange-100",
    iconText: "text-orange-500",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
    iconText: "text-blue-500",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-100",
    iconBg: "bg-red-100",
    iconText: "text-red-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
  },
};

/**
 * SummaryCard
 * One of the four top summary tiles (Pending / Approved / Rejected / Total Processed).
 */
export default function SummaryCard({ icon: Icon, number, title, subtitle, color = "blue" }) {
  const theme = THEMES[color] ?? THEMES.blue;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border ${theme.border} ${theme.bg} p-4 sm:p-5`}
    >
      <div className={`w-12 h-12 rounded-lg ${theme.iconBg} ${theme.iconText} flex items-center justify-center shrink-0`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 leading-tight">{number}</p>
        <p className="text-sm font-medium text-slate-700 truncate">{title}</p>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
    </div>
  );
}
