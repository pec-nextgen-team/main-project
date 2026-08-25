/**
 * InspectionInformationForm
 * "Inspection Information" section — filled in during the Inspection stage.
 */
export default function InspectionInformationForm({ form, onChange, damageTypes }) {
  const set = (key) => (e) => onChange({ ...form, [key]: e.target.value });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-4">Inspection Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Inspected By">
          <input
            value={form.inspectedBy}
            onChange={set("inspectedBy")}
            placeholder="e.g. Mr. Karthik"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Inspection Date">
          <input
            value={form.inspectionDate}
            onChange={set("inspectionDate")}
            placeholder="dd-mm-yyyy"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Damage Type">
          <select
            value={form.damageType}
            onChange={set("damageType")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            <option value="">Select damage type</option>
            {damageTypes.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>

        <Field label="Estimated Repair Cost">
          <input
            value={form.estimatedRepairCost}
            onChange={set("estimatedRepairCost")}
            placeholder="₹"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Repair Required">
          <select
            value={form.repairRequired}
            onChange={set("repairRequired")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <Field label="Issue Identified">
          <textarea
            value={form.issueIdentified}
            onChange={set("issueIdentified")}
            rows={2}
            placeholder="Describe the issue found during inspection..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0757D9]/30 focus:border-[#0757D9]"
          />
        </Field>

        <Field label="Inspection Remarks (optional)">
          <textarea
            value={form.inspectionRemarks}
            onChange={set("inspectionRemarks")}
            rows={2}
            placeholder="Any additional inspection notes..."
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
