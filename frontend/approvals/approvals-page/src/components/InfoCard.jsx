import { CheckCircle2, Phone, Mail } from "lucide-react";

/**
 * InfoCard
 * variant="guidelines" -> "Approval Guidelines" checklist card
 * variant="help"       -> "Need Help?" contact card (green background)
 */
export default function InfoCard({ variant }) {
  if (variant === "help") {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Need Help?</h3>
        <p className="text-xs text-slate-600 mb-3">For any assistance, contact</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone size={15} className="text-green-600" /> 044 - 2649 1113
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Mail size={15} className="text-green-600" /> support@panimalar.ac.in
          </div>
        </div>
      </div>
    );
  }

  const points = [
    "Review the complaint details carefully.",
    "Verify the problem and location.",
    "Approve to open a ticket for action.",
    "Reject if the complaint is invalid.",
    "Provide remarks for rejection.",
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Approval Guidelines</h3>
      <ul className="space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 size={15} className="text-green-600 mt-0.5 shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
