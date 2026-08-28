import { FileText, Package, Workflow, History } from "lucide-react";

const STATUS_STYLES = {
  Closed: "bg-green-50 text-green-700 border border-green-100",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-100",
  Inspection: "bg-blue-50 text-blue-700 border border-blue-100",
  Verification: "bg-yellow-50 text-yellow-700 border border-yellow-100",
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}

export function ComplaintInfoCard({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-[#0757D9]" />
        <h3 className="text-sm font-semibold text-slate-800">Complaint Information</h3>
      </div>
      <div className="space-y-2.5">
        <InfoRow label="Complaint No." value={data.complaintNo} />
        <InfoRow label="Category" value={data.category} />
        <InfoRow label="Location" value={data.location} />
        <InfoRow label="Priority" value={data.priority} />
        <InfoRow
          label="Current Status"
          value={
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[data.currentStatus] ?? ""}`}>
              {data.currentStatus}
            </span>
          }
        />
      </div>
    </div>
  );
}

export function AccessoryInfoCard({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-[#0757D9]" />
        <h3 className="text-sm font-semibold text-slate-800">Accessory Information</h3>
      </div>
      <div className="space-y-2.5">
        <InfoRow label="Accessory Name" value={data.accessoryName} />
        <InfoRow label="Asset / Serial No." value={data.assetSerialNo} />
        <InfoRow label="Department" value={data.department} />
        <InfoRow label="Purchase Date" value={data.purchaseDate} />
        <InfoRow
          label="Warranty Status"
          value={
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                data.warrantyStatus === "Expired"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-green-50 text-green-700 border border-green-100"
              }`}
            >
              {data.warrantyStatus}
            </span>
          }
        />
      </div>
    </div>
  );
}

export function WorkflowSummaryCard({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Workflow size={16} className="text-[#0757D9]" />
        <h3 className="text-sm font-semibold text-slate-800">Workflow Summary</h3>
      </div>
      <div className="space-y-2.5">
        <InfoRow
          label="Current Stage"
          value={<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">{data.currentStage}</span>}
        />
        <InfoRow label="Assigned Technician" value={data.assignedTechnician} />
        <InfoRow label="Expected Completion" value={data.expectedCompletion} />
        <InfoRow
          label="SLA Status"
          value={
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
              {data.slaStatus}
            </span>
          }
        />
      </div>
    </div>
  );
}

export function RecentComplaintsCard({ complaints }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <History size={16} className="text-[#0757D9]" />
        <h3 className="text-sm font-semibold text-slate-800">Recent Complaints</h3>
      </div>
      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c.complaintNo} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
            <div className="min-w-0">
              <p className="font-medium text-[#0757D9] truncate">{c.complaintNo}</p>
              <p className="text-xs text-slate-500">
                {c.accessory} • {c.date}
              </p>
            </div>
            <span
              className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                STATUS_STYLES[c.status] ?? "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
