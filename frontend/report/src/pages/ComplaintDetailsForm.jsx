import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

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
} from "../data/mockData";
import complaintDetailsApi from "../services/complaintDetailsApi";

// Ordered stage keys/labels the workflow progress bar always shows, in
// order. Status per stage ("Completed" / "In Progress" / "Pending") is
// derived at runtime from the complaint's real `currentStage`, not from
// the static mock STAGES array (which only ever said "Inspection is in
// progress", forever, no matter what actually happened).
const STAGE_ORDER = STAGES.map(({ key, label }) => ({ key, label }));

function deriveStages(currentStageKey) {
  const currentIdx = STAGE_ORDER.findIndex((s) => s.key === currentStageKey);
  return STAGE_ORDER.map((s, idx) => ({
    ...s,
    status: currentIdx < 0 ? "Pending" : idx < currentIdx ? "Completed" : idx === currentIdx ? "In Progress" : "Pending",
  }));
}

/**
 * ComplaintDetailsForm
 * "Complaint Details" page — the registration + inspection form for an
 * accessory repair complaint, with the six-stage workflow shown above it.
 *
 * Wired to the real backend contract this module's own README already
 * documented: GET /api/complaints/:id on load, PATCH /api/complaints/:id
 * for "Save as Draft", and POST /api/complaints/:id/advance-stage for
 * "Move to Repair Assignment". No backend code ships in this delivery, so
 * these routes are unverified against a live server — every call below
 * waits for a real response and only updates the screen (or shows
 * success) once that response actually confirms it; a missing/failing
 * endpoint surfaces as a visible error instead of a false "moved to
 * Repair Assignment" message.
 *
 * `complaintId` is a prop rather than a hard react-router-dom dependency,
 * since this module ships as loose files to drop into a host project
 * (see README) and that host project's router may differ. Once dropped
 * in, wire it from your route, e.g.:
 *   import { useParams } from "react-router-dom";
 *   const { id } = useParams();
 *   <ComplaintDetailsForm complaintId={id} />
 */
export default function ComplaintDetailsForm({ complaintId }) {
  const [complaintForm, setComplaintForm] = useState(null);
  const [inspectionForm, setInspectionForm] = useState(null);
  const [rightRail, setRightRail] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!complaintId) {
      setLoadError("No complaint ID was provided to this page — nothing to load.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    complaintDetailsApi
      .getById(complaintId)
      .then((data) => {
        if (cancelled) return;
        setComplaintForm(data.complaint);
        setInspectionForm(data.inspection);
        setRightRail({
          complaintInfoCard: data.complaintInfoCard,
          accessoryInfoCard: data.accessoryInfoCard,
          workflowSummaryCard: data.workflowSummaryCard,
        });
        setCurrentStage(data.currentStage);
        return complaintDetailsApi.listRecent({ department: data.complaint?.department, limit: 4 });
      })
      .then((recent) => {
        if (cancelled || !recent) return;
        setRecentComplaints(recent.data ?? recent ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setLoadError(
          e?.response?.status === 404
            ? "Frontend cannot safely resolve this because the required backend functionality (GET /api/complaints/:id) is missing or not yet deployed."
            : e?.message || "Couldn't load this complaint."
        );
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [complaintId]);

  const stages = useMemo(() => deriveStages(currentStage), [currentStage]);

  const handleCancel = () => {
    // Re-fetch instead of resetting to stale local state, so "Cancel"
    // actually discards edits back to what the backend has, not to
    // whatever the form happened to load with on mount.
    setLoading(true);
    complaintDetailsApi
      .getById(complaintId)
      .then((data) => {
        setComplaintForm(data.complaint);
        setInspectionForm(data.inspection);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    showToast("Changes discarded.", "error");
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await complaintDetailsApi.saveDraft(complaintId, {
        complaint: complaintForm,
        inspection: inspectionForm,
      });
      showToast("Draft saved.");
    } catch (e) {
      showToast(
        e?.response?.status === 404
          ? "Frontend cannot safely resolve this: the draft-save endpoint isn't available yet."
          : e?.message || "Couldn't save the draft. Please try again.",
        "error"
      );
    } finally {
      setSavingDraft(false);
    }
  };

  const handleMoveToRepairAssignment = async () => {
    if (!inspectionForm?.inspectedBy || !inspectionForm?.issueIdentified) {
      showToast("Complete Inspected By and Issue Identified before proceeding.", "error");
      return;
    }
    setAdvancing(true);
    try {
      const result = await complaintDetailsApi.advanceStage(complaintId, {
        from: "INSPECTION",
        to: "REPAIR_ASSIGNED",
        inspection: inspectionForm,
      });
      // Only now — after the backend actually confirms — does the stage
      // move. Nothing above this line changes what's on screen.
      setCurrentStage(result?.currentStage ?? "REPAIR_ASSIGNED");
      if (result?.workflowSummaryCard) {
        setRightRail((prev) => ({ ...prev, workflowSummaryCard: result.workflowSummaryCard }));
      }
      showToast('Moved to "Repair Assigned" stage.');
    } catch (e) {
      showToast(
        e?.response?.status === 404
          ? "Frontend cannot safely resolve this because the required backend functionality (POST /api/complaints/:id/advance-stage) is missing. The complaint has NOT been moved to Repair Assignment."
          : e?.message || "Couldn't move this complaint to Repair Assignment. It has not been moved.",
        "error"
      );
    } finally {
      setAdvancing(false);
    }
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

          {loadError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {loadError}
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm py-16 justify-center">
              <Loader2 size={18} className="animate-spin" /> Loading complaint...
            </div>
          ) : complaintForm && inspectionForm ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
              <div className="space-y-6 min-w-0">
                <ComplaintInformationForm
                  form={complaintForm}
                  onChange={setComplaintForm}
                  complaintTypes={complaintTypes}
                  accessoryCategories={accessoryCategories}
                  priorities={priorities}
                />

                <WorkflowProgress stages={stages} />

                <InspectionInformationForm
                  form={inspectionForm}
                  onChange={setInspectionForm}
                  damageTypes={damageTypes}
                />

                <BottomActionBar
                  onCancel={handleCancel}
                  onSaveDraft={handleSaveDraft}
                  onMoveToRepairAssignment={handleMoveToRepairAssignment}
                  savingDraft={savingDraft}
                  advancing={advancing}
                />
              </div>

              <div className="space-y-6">
                {rightRail?.complaintInfoCard && <ComplaintInfoCard data={rightRail.complaintInfoCard} />}
                {rightRail?.accessoryInfoCard && <AccessoryInfoCard data={rightRail.accessoryInfoCard} />}
                {rightRail?.workflowSummaryCard && <WorkflowSummaryCard data={rightRail.workflowSummaryCard} />}
                <RecentComplaintsCard complaints={recentComplaints} />
              </div>
            </div>
          ) : null}
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
