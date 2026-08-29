import React, { useState } from 'react';
import { 
  MapPin, 
  Wrench, 
  Phone, 
  Mail, 
  CheckCircle2, 
  RotateCcw, 
  Send,
  FileText
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import WorkflowTracker from '../../components/common/WorkflowTracker';
import { FormField, Input, Select, Textarea } from '../../components/common/FormControls';
import Button from '../../components/common/Button';
import complaintService, { PRIORITY_LEVELS, COMPLAINT_STATUS } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

export function RaiseComplaintPage({ onComplaintCreated }) {
  const { user } = useAuth();

  // Form State (ZERO hardcoded fake data)
  const [formData, setFormData] = useState({
    location: '',
    roomLab: '',
    category: '',
    priority: PRIORITY_LEVELS.MEDIUM,
    description: '',
    contactNumber: '',
    contactEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      location: '',
      roomLab: '',
      category: '',
      priority: PRIORITY_LEVELS.MEDIUM,
      description: '',
      contactNumber: '',
      contactEmail: '',
    });
    setErrors({});
    setSubmittedComplaint(null);
  };

  // Form validation
  const validate = () => {
    const errs = {};
    if (!formData.location.trim()) {
      errs.location = 'Please specify the Campus Block / Department Building.';
    }
    if (!formData.roomLab.trim()) {
      errs.roomLab = 'Please specify the Room Number / Laboratory Name.';
    }
    if (!formData.category.trim()) {
      errs.category = 'Please select or enter the issue category.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please provide a detailed description of the maintenance issue.';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description must contain at least 10 characters.';
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errs.contactEmail = 'Please enter a valid email address.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await complaintService.createComplaint(
        formData,
        user?.identifier || 'Campus Staff / Student'
      );
      setSubmittedComplaint(created);
      if (onComplaintCreated) {
        onComplaintCreated(created);
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Failed to submit complaint. Please check your network and try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Raise Maintenance Complaint"
        subtitle="Register a new electrical, equipment, or facility maintenance requisition for HOD review."
        breadcrumbs={['Complaints', 'Raise Complaint']}
      />

      {/* Workflow Tracker Overview */}
      <WorkflowTracker currentStatus={COMPLAINT_STATUS.PENDING} />

      {/* Success Notification Banner */}
      {submittedComplaint && (
        <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-xs animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-emerald-900">
                Complaint Registered Successfully
              </h3>
              <p className="text-sm text-emerald-800 mt-1">
                Your complaint has been logged under Reference ID{' '}
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-950">
                  {submittedComplaint.id}
                </span>{' '}
                and forwarded to the Head of Department for approval.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleReset}
                  icon={RotateCcw}
                >
                  Raise Another Complaint
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Card */}
      <Card
        title="Maintenance Requisition Form"
        subtitle="Please ensure all required fields are accurately completed for expedited departmental clearance."
        icon={FileText}
      >
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Section 1: Location & Facility Particulars */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                1. Location & Facility Details
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Block / Building / Facility"
                required
                id="field-location"
                error={errors.location}
                helperText="Specify the institutional building (e.g. Main Block, Mechanical Block, Central Library, Hostel Block A)"
              >
                <Input
                  id="field-location"
                  name="location"
                  placeholder="e.g. Academic Block III"
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                />
              </FormField>

              <FormField
                label="Room / Lab / Hall Identifier"
                required
                id="field-room"
                error={errors.roomLab}
                helperText="Specify the exact room number, laboratory name, or department floor"
              >
                <Input
                  id="field-room"
                  name="roomLab"
                  placeholder="e.g. Room 204 / Power Electronics Lab"
                  value={formData.roomLab}
                  onChange={handleChange}
                  error={errors.roomLab}
                />
              </FormField>
            </div>
          </div>

          {/* Section 2: Issue & Priority Details */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
              <Wrench className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                2. Issue Classification & Priority
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <FormField
                label="Issue Category"
                required
                id="field-category"
                error={errors.category}
                helperText="Select or specify the primary maintenance domain"
              >
                <Select
                  id="field-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                  options={[
                    'Lighting & Fixtures',
                    'Power Outlets / Plug Points',
                    'Switchboard & Breakers',
                    'Air Conditioning / HVAC',
                    'Ceiling Fan & Ventilation',
                    'UPS / Power Backup Inverter',
                    'Laboratory Equipment Power Feed',
                    'General Wiring & Conduit',
                    'Other Electrical Issue',
                  ]}
                  placeholder="Select maintenance category..."
                />
              </FormField>

              <FormField
                label="Urgency / Priority Level"
                required
                id="field-priority"
                helperText="Emergency is reserved for live wire hazards or complete power outages"
              >
                <Select
                  id="field-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: PRIORITY_LEVELS.LOW, label: 'Low — Routine maintenance' },
                    { value: PRIORITY_LEVELS.MEDIUM, label: 'Medium — Standard departmental requirement' },
                    { value: PRIORITY_LEVELS.HIGH, label: 'High — Disrupting active lab/class session' },
                    { value: PRIORITY_LEVELS.EMERGENCY, label: 'Emergency — Immediate electrical hazard' },
                  ]}
                />
              </FormField>
            </div>

            <FormField
              label="Detailed Description of Fault / Breakdown"
              required
              id="field-description"
              error={errors.description}
              helperText="Provide specific details about the fault, symptoms, equipment involved, and any safety precautions taken."
            >
              <Textarea
                id="field-description"
                name="description"
                rows={4}
                placeholder="Describe the nature of the electrical issue clearly..."
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />
            </FormField>
          </div>

          {/* Section 3: Contact & Verification Information */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
              <Phone className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                3. Contact Information (Optional)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Contact Phone / Extension"
                id="field-contact-phone"
                helperText="Direct number or intercom for technician site contact"
              >
                <Input
                  id="field-contact-phone"
                  name="contactNumber"
                  placeholder="e.g. 044-26490404 / Intercom 214"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  icon={Phone}
                />
              </FormField>

              <FormField
                label="Institutional Email Address"
                id="field-contact-email"
                error={errors.contactEmail}
                helperText="Email address to receive status dispatch notifications"
              >
                <Input
                  id="field-contact-email"
                  name="contactEmail"
                  type="email"
                  placeholder="e.g. staff@panimalar.ac.in"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  error={errors.contactEmail}
                  icon={Mail}
                />
              </FormField>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              * Mandatory fields required for departmental audit and approval.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="cancel"
                onClick={handleReset}
                icon={RotateCcw}
                className="w-full sm:w-auto"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                icon={Send}
                className="w-full sm:w-auto"
              >
                Submit Requisition
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RaiseComplaintPage;
