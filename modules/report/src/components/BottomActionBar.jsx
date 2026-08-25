/**
 * BottomActionBar
 * Cancel (neutral), Save as Draft (outlined blue), Move to Repair
 * Assignment (solid blue primary action).
 */
export default function BottomActionBar({ onCancel, onSaveDraft, onMoveToRepairAssignment }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 sm:px-5 py-4 flex flex-wrap justify-end gap-2.5">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSaveDraft}
        className="px-4 py-2 rounded-lg text-sm font-medium text-[#0757D9] border border-[#0757D9] hover:bg-blue-50 transition-colors"
      >
        Save as Draft
      </button>
      <button
        onClick={onMoveToRepairAssignment}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0757D9] text-white hover:bg-[#0645b3] transition-colors"
      >
        Move to Repair Assignment
      </button>
    </div>
  );
}
