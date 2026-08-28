export default function CategoryCard({ icon: Icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all
        ${
          selected
            ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
            : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
        }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className={`text-sm font-semibold ${selected ? 'text-brand-700' : 'text-slate-800'}`}>
        {title}
      </p>
      <p className="text-xs leading-snug text-slate-500">{description}</p>
    </button>
  );
}
