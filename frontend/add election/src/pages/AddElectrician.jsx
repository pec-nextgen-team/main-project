import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, X, UserPlus } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import FormInput from '../components/FormInput.jsx'
import FormSelect from '../components/FormSelect.jsx'
import FormTextarea from '../components/FormTextarea.jsx'
import FormSection from '../components/FormSection.jsx'
import SpecializationCheckboxes from '../components/SpecializationCheckboxes.jsx'
import Toast from '../components/Toast.jsx'
import electricianService from '../services/electricianService.js'
import ElectricianInfoCard from '../components/electrician/ElectricianInfoCard.jsx'
import EmploymentTypesCard from '../components/electrician/EmploymentTypesCard.jsx'
import SpecializationHelpCard from '../components/electrician/SpecializationHelpCard.jsx'
import ElectricianWorkflowCard from '../components/electrician/ElectricianWorkflowCard.jsx'
import {
  genderOptions,
  stateOptions,
  departmentOptions,
  employmentTypeOptions,
  reportingToOptions,
  workLocationOptions,
  shiftOptions,
  statusOptions,
} from '../data/electricianOptions.js'
import {
  isValidEmail,
  isValidPhone,
  isValidAadhaar,
  isValidPan,
  isValidPinCode,
  isValidDate,
} from '../utils/validators.js'

function generateEmployeeId() {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `ELEC-EMP-${year}-${random}`
}

const INITIAL_FORM = {
  employeeId: generateEmployeeId(),
  fullName: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  email: '',
  aadhaarNumber: '',
  panNumber: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',
  department: '',
  employmentType: '',
  dateOfJoining: '',
  reportingTo: '',
  workLocation: '',
  shift: '',
  status: 'Active',
  specialization: [],
  skills: '',
  emergencyContactName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  alternatePhone: '',
}

const REQUIRED_FIELDS = [
  'fullName',
  'dateOfBirth',
  'gender',
  'phoneNumber',
  'address',
  'city',
  'state',
  'pinCode',
  'department',
  'employmentType',
  'dateOfJoining',
  'reportingTo',
  'workLocation',
  'status',
  'skills',
  'emergencyContactName',
  'emergencyRelationship',
  'emergencyPhone',
]

export default function AddElectrician() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const set = (key) => (e) => {
    const value = e && e.target ? e.target.value : e
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}

    REQUIRED_FIELDS.forEach((field) => {
      const value = form[field]
      const isEmpty = Array.isArray(value) ? value.length === 0 : !String(value || '').trim()
      if (isEmpty) nextErrors[field] = 'This field is required.'
    })

    if (form.dateOfBirth && !isValidDate(form.dateOfBirth)) {
      nextErrors.dateOfBirth = 'Enter a valid date of birth.'
    }
    if (form.dateOfJoining && !isValidDate(form.dateOfJoining)) {
      nextErrors.dateOfJoining = 'Enter a valid date of joining.'
    }
    if (form.phoneNumber && !isValidPhone(form.phoneNumber)) {
      nextErrors.phoneNumber = 'Enter a valid 10-digit phone number.'
    }
    if (form.emergencyPhone && !isValidPhone(form.emergencyPhone)) {
      nextErrors.emergencyPhone = 'Enter a valid 10-digit phone number.'
    }
    if (form.alternatePhone && !isValidPhone(form.alternatePhone)) {
      nextErrors.alternatePhone = 'Enter a valid 10-digit phone number.'
    }
    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!isValidAadhaar(form.aadhaarNumber)) {
      nextErrors.aadhaarNumber = 'Aadhaar number must be 12 digits.'
    }
    if (!isValidPan(form.panNumber)) {
      nextErrors.panNumber = 'Enter a valid PAN (e.g. ABCDE1234F).'
    }
    if (form.pinCode && !isValidPinCode(form.pinCode)) {
      nextErrors.pinCode = 'PIN code must be 6 digits.'
    }
    if (form.specialization.length === 0) {
      nextErrors.specialization = 'Select at least one specialization.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const resetForm = () => {
    setForm({ ...INITIAL_FORM, employeeId: generateEmployeeId() })
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    navigate('/electrician/list')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      setToast({
        type: 'error',
        title: 'Please fix the highlighted fields',
        message: 'Some required information is missing or invalid.',
      })
      return
    }

    setSubmitting(true)
    try {
      // Success is only ever reported (and the form only ever reset) once
      // the backend confirms the electrician was actually saved — never
      // on a failed or unreachable request.
      await electricianService.create(form)

      setToast({
        type: 'success',
        title: 'Electrician added successfully',
        message: `${form.fullName} has been added with ID ${form.employeeId}.`,
      })
      resetForm()
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Could not add electrician',
        message: err?.response?.data?.message || 'Something went wrong while saving. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Add Electrician"
        breadcrumbItems={['Home', 'Electrician', 'Add Electrician']}
        icon="add"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-5">
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4 sm:p-6">
            {/* Section 1: Personal Information */}
            <FormSection title="Personal Information" divider={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormInput
                  label="Employee ID"
                  required
                  value={form.employeeId}
                  disabled
                  hint="Auto generated"
                />
                <FormInput
                  label="Full Name"
                  required
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={set('fullName')}
                  error={errors.fullName}
                />
                <FormInput
                  label="Date of Birth"
                  required
                  type="date"
                  icon={Calendar}
                  value={form.dateOfBirth}
                  onChange={set('dateOfBirth')}
                  error={errors.dateOfBirth}
                />
                <FormSelect
                  label="Gender"
                  required
                  placeholder="Select Gender"
                  options={genderOptions}
                  value={form.gender}
                  onChange={set('gender')}
                  error={errors.gender}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <FormInput
                  label="Phone Number"
                  required
                  prefix="+91"
                  placeholder="Enter phone number"
                  value={form.phoneNumber}
                  onChange={set('phoneNumber')}
                  error={errors.phoneNumber}
                  maxLength={10}
                />
                <FormInput
                  label="Email ID"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                />
                <FormInput
                  label="Aadhaar Number"
                  placeholder="Enter Aadhaar number"
                  value={form.aadhaarNumber}
                  onChange={set('aadhaarNumber')}
                  error={errors.aadhaarNumber}
                  maxLength={12}
                />
                <FormInput
                  label="PAN Number"
                  placeholder="Enter PAN number"
                  value={form.panNumber}
                  onChange={(e) => set('panNumber')(e.target.value.toUpperCase())}
                  error={errors.panNumber}
                  maxLength={10}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="lg:col-span-1 sm:col-span-2">
                  <FormTextarea
                    label="Address"
                    required
                    placeholder="Enter complete address"
                    value={form.address}
                    onChange={set('address')}
                    error={errors.address}
                    maxLength={200}
                    rows={2}
                  />
                </div>
                <FormInput
                  label="City"
                  required
                  placeholder="Enter city"
                  value={form.city}
                  onChange={set('city')}
                  error={errors.city}
                />
                <FormSelect
                  label="State"
                  required
                  placeholder="Select State"
                  options={stateOptions}
                  value={form.state}
                  onChange={set('state')}
                  error={errors.state}
                />
                <FormInput
                  label="PIN Code"
                  required
                  placeholder="Enter PIN code"
                  value={form.pinCode}
                  onChange={set('pinCode')}
                  error={errors.pinCode}
                  maxLength={6}
                />
              </div>
            </FormSection>

            {/* Section 2: Employment Information */}
            <FormSection title="Employment Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormSelect
                  label="Department"
                  required
                  placeholder="Select Department"
                  options={departmentOptions}
                  value={form.department}
                  onChange={set('department')}
                  error={errors.department}
                />
                <FormSelect
                  label="Employment Type"
                  required
                  placeholder="Select Type"
                  options={employmentTypeOptions}
                  value={form.employmentType}
                  onChange={set('employmentType')}
                  error={errors.employmentType}
                />
                <FormInput
                  label="Date of Joining"
                  required
                  type="date"
                  icon={Calendar}
                  value={form.dateOfJoining}
                  onChange={set('dateOfJoining')}
                  error={errors.dateOfJoining}
                />
                <FormSelect
                  label="Reporting To"
                  required
                  placeholder="Select Reporting To"
                  options={reportingToOptions}
                  value={form.reportingTo}
                  onChange={set('reportingTo')}
                  error={errors.reportingTo}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <FormSelect
                  label="Work Location / Building"
                  required
                  placeholder="Select Location"
                  options={workLocationOptions}
                  value={form.workLocation}
                  onChange={set('workLocation')}
                  error={errors.workLocation}
                />
                <FormSelect
                  label="Shift"
                  placeholder="Select Shift"
                  options={shiftOptions}
                  value={form.shift}
                  onChange={set('shift')}
                />
                <FormSelect
                  label="Status"
                  required
                  options={statusOptions}
                  value={form.status}
                  onChange={set('status')}
                  error={errors.status}
                />
              </div>
            </FormSection>

            {/* Section 3: Specialization & Skills */}
            <FormSection title="Specialization & Skills">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpecializationCheckboxes
                  selected={form.specialization}
                  onChange={(val) => {
                    setForm((f) => ({ ...f, specialization: val }))
                    if (errors.specialization) setErrors((er) => ({ ...er, specialization: undefined }))
                  }}
                  error={errors.specialization}
                />
                <FormTextarea
                  label="Skills / Expertise"
                  required
                  placeholder="Enter skills (e.g. Wiring, Lighting, Panels, Pumps, Pipe Fitting)"
                  value={form.skills}
                  onChange={set('skills')}
                  error={errors.skills}
                  maxLength={200}
                  rows={5}
                />
              </div>
            </FormSection>

            {/* Section 4: Emergency Contact */}
            <FormSection title="Emergency Contact">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormInput
                  label="Contact Person Name"
                  required
                  placeholder="Enter contact person name"
                  value={form.emergencyContactName}
                  onChange={set('emergencyContactName')}
                  error={errors.emergencyContactName}
                />
                <FormInput
                  label="Relationship"
                  required
                  placeholder="Enter relationship"
                  value={form.emergencyRelationship}
                  onChange={set('emergencyRelationship')}
                  error={errors.emergencyRelationship}
                />
                <FormInput
                  label="Phone Number"
                  required
                  prefix="+91"
                  placeholder="Enter phone number"
                  value={form.emergencyPhone}
                  onChange={set('emergencyPhone')}
                  error={errors.emergencyPhone}
                  maxLength={10}
                />
                <FormInput
                  label="Alternate Phone"
                  prefix="+91"
                  placeholder="Enter alternate number"
                  value={form.alternatePhone}
                  onChange={set('alternatePhone')}
                  error={errors.alternatePhone}
                  maxLength={10}
                />
              </div>
            </FormSection>

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-7 pt-5 border-t border-slate-100">
              <p className="text-[12px] text-slate-400 order-2 sm:order-1">
                * Indicates mandatory fields
              </p>
              <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[13.5px] font-medium rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X size={15} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[13.5px] font-semibold rounded-md bg-brand-blue text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <UserPlus size={15} />
                  {submitting ? 'Saving…' : 'Save Electrician'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <ElectricianInfoCard />
          <EmploymentTypesCard />
          <SpecializationHelpCard />
          <ElectricianWorkflowCard />
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
