import { CheckCircle2, XCircle } from "lucide-react";

/**
 * Toast
 * Small transient success/error notification, positioned bottom-right.
 * Parent controls visibility/timing.
 */
export default function Toast({ toast }) {
  if (!toast) return null;

  const isSuccess = toast.type !== "error";

  return (
    <div className="fixed bottom-5 right-5 z-[60] animate-in fade-in slide-in-from-bottom-2">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
          isSuccess
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {toast.message}
      </div>
    </div>
  );
}
