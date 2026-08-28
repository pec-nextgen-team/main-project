import {
  FileText,
  ClipboardCheck,
  Ticket,
  Wrench,
  HardHat,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

const STEPS = [
  { title: "Complaint Reported", subtitle: "By Supervisor", icon: FileText },
  { title: "HOD Approval", subtitle: "You are here", icon: ClipboardCheck, active: true },
  { title: "Ticket Created", subtitle: "After Approval", icon: Ticket },
  { title: "Assigned to Electrician", subtitle: "By Electrician Head", icon: HardHat },
  { title: "Repair / Maintenance", subtitle: null, icon: Wrench },
  { title: "HOD Verification", subtitle: null, icon: ShieldCheck },
  { title: "Closure & Report Distribution", subtitle: null, icon: PackageCheck },
];

/**
 * WorkflowSummary
 * Vertical connected-step workflow, with "HOD Approval" highlighted
 * as the current active stage.
 */
export default function WorkflowSummary() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Workflow Summary</h3>
      <ol className="relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === STEPS.length - 1;
          return (
            <li key={step.title} className="relative pl-9 pb-5 last:pb-0">
              {!isLast && (
                <span className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200" />
              )}
              <span
                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.active
                    ? "bg-[#0757D9] text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon size={15} />
              </span>
              <p className={`text-sm ${step.active ? "font-semibold text-[#0757D9]" : "font-medium text-slate-700"}`}>
                {idx + 1}. {step.title}
              </p>
              {step.subtitle && (
                <p className={`text-xs mt-0.5 ${step.active ? "text-[#0757D9]/70" : "text-slate-400"}`}>
                  {step.subtitle}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
