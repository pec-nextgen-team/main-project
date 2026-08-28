import { Check } from "lucide-react";

const BADGE_STYLES = {
  Completed: "bg-green-50 text-green-700 border border-green-100",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-100",
  Pending: "bg-slate-100 text-slate-500 border border-slate-200",
};

/**
 * WorkflowProgress
 * Repair Workflow — six-stage horizontal progress indicator with
 * Completed/In Progress/Pending status badges under each stage.
 * Current stage (In Progress) is highlighted in blue.
 */
export default function WorkflowProgress({ stages }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-5">Repair Workflow</h2>

      <div className="overflow-x-auto">
        <div className="flex items-start min-w-[720px] sm:min-w-0">
          {stages.map((stage, idx) => {
            const isLast = idx === stages.length - 1;
            const isCompleted = stage.status === "Completed";
            const isCurrent = stage.status === "In Progress";

            return (
              <div key={stage.key} className="flex-1 flex items-start">
                <div className="flex flex-col items-center text-center px-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-[#0757D9] text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : idx + 1}
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium max-w-[110px] ${
                      stage.status === "Pending" ? "text-slate-400" : "text-slate-800"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <span
                    className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${BADGE_STYLES[stage.status]}`}
                  >
                    {stage.status}
                  </span>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-px mt-[18px] ${isCompleted ? "bg-green-300" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
