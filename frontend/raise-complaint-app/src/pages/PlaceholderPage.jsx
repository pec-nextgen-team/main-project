export default function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-sm text-slate-500">This page is not part of the current build.</p>
      </div>
    </div>
  );
}
