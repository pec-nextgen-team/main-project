/**
 * ComplaintInformationForm
 * "Complaint Information" section — controlled text/select inputs plus
 * the full-width Problem Description and Remarks text areas.
 */
export default function ComplaintInformationForm({ form, onChange, complaintTypes, accessoryCategories, priorities }) {
  const set = (key) => (e) => onChange({ ...form, [key]: e.target.value });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4">Complaint Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Complaint No.">
          <input
            value={form.complaintNo}
            disabled
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 bg-slate-50"
          />
        </Field>

        <Field label="Complaint Date">
          <input
            value={form.complaintDate}
            onChange={set("complaintDate")}
            placeholder="dd-mm-yyyy"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Complaint Type">
          <select
            value={form.complaintType}
            onChange={set("complaintType")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {complaintTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Accessory Category">
          <select
            value={form.accessoryCategory}
            onChange={set("accessoryCategory")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {accessoryCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Accessory Name">
          <input
            value={form.accessoryName}
            onChange={set("accessoryName")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Location / Department">
          <input
            value={form.department}
            onChange={set("department")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Room / Location">
          <input
            value={form.roomLocation}
            onChange={set("roomLocation")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Reported By">
          <input
            value={form.reportedBy}
            onChange={set("reportedBy")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Priority">
          <select
            value={form.priority}
            onChange={set("priority")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            {priorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Field label="Problem Description">
          <textarea
            value={form.problemDescription}
            onChange={set("problemDescription")}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Remarks (optional)">
          <textarea
            value={form.remarks}
            onChange={set("remarks")}
            rows={3}
            placeholder="Any additional remarks..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
