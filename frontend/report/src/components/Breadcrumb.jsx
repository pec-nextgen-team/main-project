import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb
 * Small dark-blue trail: Home > Complaints > Complaint Details
 */
export default function Breadcrumb({ items }) {
  return (
    <p className="flex items-center flex-wrap gap-1 text-sm text-[#062B5C]/60">
      {items.map((item, idx) => (
        <span key={item} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight size={13} className="text-slate-300" />}
          <span className={idx === items.length - 1 ? "text-[#062B5C] font-medium" : ""}>{item}</span>
        </span>
      ))}
    </p>
  );
}
