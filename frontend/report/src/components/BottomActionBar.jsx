import { Loader2 } from "lucide-react";

/**
 * BottomActionBar
 * Cancel (neutral), Save as Draft (outlined blue), Move to Repair
 * Assignment (solid blue primary action).
 *
 * `savingDraft` / `advancing` disable the relevant button and show a
 * spinner while the real API call is in flight — buttons never look
 * clickable-and-instant when a network round trip is actually happening.
 */
export default function BottomActionBar({
  onCancel,
  onSaveDraft,
  onMoveToRepairAssignment,
  savingDraft = false,
  advancing = false,
}) {
  const busy = savingDraft || advancing;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 sm:px-5 py-4 flex flex-wrap justify-end gap-2.5">
      <button
        onClick={onCancel}
        disabled={busy}
        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={onSaveDraft}
        disabled={busy}
        className="px-4 py-2 rounded-lg text-sm font-medium text-[#0757D9] border border-[#0757D9] hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {savingDraft && <Loader2 size={14} className="animate-spin" />}
        {savingDraft ? "Saving..." : "Save as Draft"}
      </button>
      <button
        onClick={onMoveToRepairAssignment}
        disabled={busy}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0757D9] text-white hover:bg-[#0645b3] transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {advancing && <Loader2 size={14} className="animate-spin" />}
        {advancing ? "Moving..." : "Move to Repair Assignment"}
      </button>
    </div>
  );
}
