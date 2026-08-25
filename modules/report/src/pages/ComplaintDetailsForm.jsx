import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import Breadcrumb from "../components/Breadcrumb";
import WorkflowProgress from "../components/WorkflowProgress";
import ComplaintInformationForm from "../components/ComplaintInformationForm";
import InspectionInformationForm from "../components/InspectionInformationForm";
import {
  ComplaintInfoCard,
  AccessoryInfoCard,
  WorkflowSummaryCard,
  RecentComplaintsCard,
} from "../components/RightSidebarCards";
import BottomActionBar from "../components/BottomActionBar";
import Toast from "../components/Toast";

import {
  STAGES,
  complaintTypes,
  accessoryCategories,
  priorities,
  damageTypes,
  initialComplaintForm,
  initialInspectionForm,
  complaintInfoCard,
  accessoryInfoCard,
  workflowSummaryCard,
  recentComplaints,
} from "../data/mockData";

/**
 * ComplaintDetailsForm
 * "Complaint Details" page — the registration + inspection form for an
 * accessory repair complaint, with the six-stage workflow shown above it.
 *
 * All data is local mock state (src/data/mockData.js). To connect the
 * real backend: replace the initial* imports with a
 * GET /api/complaints/:id fetch, and have the three bottom actions call
 * PATCH /api/complaints/:id (draft save) or
 * POST /api/complaints/:id/advance-stage (move to Repair Assignment)
 * instead of local state updates.
 */
export default function ComplaintDetailsForm() {
  const [complaintForm, setComplaintForm] = useState(initialComplaintForm);
  const [inspectionForm, setInspectionForm] = useState(initialInspectionForm);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleCancel = () => {
    setComplaintForm(initialComplaintForm);
    setInspectionForm(initialInspectionForm);
    showToast("Changes discarded.", "error");
  };

  const handleSaveDraft = () => {
    showToast("Draft saved.");
  };

  const handleMoveToRepairAssignment = () => {
    if (!inspectionForm.inspectedBy || !inspectionForm.issueIdentified) {
      showToast("Complete Inspected By and Issue Identified before proceeding.", "error");
      return;
    }
    showToast('Moved to "Repair Assigned" stage.');
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <TopHeader />

        <main className="p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Complaint Details</h1>
            <div className="mt-1">
              <Breadcrumb items={["Home", "Complaints", "Complaint Details"]} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="space-y-6 min-w-0">
              <ComplaintInformationForm
                form={complaintForm}
                onChange={setComplaintForm}
                complaintTypes={complaintTypes}
                accessoryCategories={accessoryCategories}
                priorities={priorities}
              />

              <WorkflowProgress stages={STAGES} />

              <InspectionInformationForm
                form={inspectionForm}
                onChange={setInspectionForm}
                damageTypes={damageTypes}
              />

              <BottomActionBar
                onCancel={handleCancel}
                onSaveDraft={handleSaveDraft}
                onMoveToRepairAssignment={handleMoveToRepairAssignment}
              />
            </div>

            <div className="space-y-6">
              <ComplaintInfoCard data={complaintInfoCard} />
              <AccessoryInfoCard data={accessoryInfoCard} />
              <WorkflowSummaryCard data={workflowSummaryCard} />
              <RecentComplaintsCard complaints={recentComplaints} />
            </div>
          </div>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
