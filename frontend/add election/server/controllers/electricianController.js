import { prisma } from '../prismaClient.js'

const REQUIRED_FIELDS = [
  'employeeId',
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

function validatePayload(body) {
  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = body[field]
    return value === undefined || value === null || String(value).trim() === ''
  })

  if (!Array.isArray(body.specialization) || body.specialization.length === 0) {
    missing.push('specialization')
  }

  return missing
}

export async function listElectricians(req, res) {
  try {
    const electricians = await prisma.electrician.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(electricians)
  } catch (err) {
    console.error('Failed to list electricians', err)
    res.status(500).json({ message: 'Failed to fetch electricians.' })
  }
}

export async function getElectrician(req, res) {
  try {
    const electrician = await prisma.electrician.findUnique({
      where: { id: req.params.id },
    })
    if (!electrician) {
      return res.status(404).json({ message: 'Electrician not found.' })
    }
    res.json(electrician)
  } catch (err) {
    console.error('Failed to fetch electrician', err)
    res.status(500).json({ message: 'Failed to fetch electrician.' })
  }
}

export async function createElectrician(req, res) {
  const missing = validatePayload(req.body)
  if (missing.length > 0) {
    return res.status(400).json({
      message: 'Missing or invalid required fields.',
      fields: missing,
    })
  }

  try {
    const {
      employeeId,
      fullName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      aadhaarNumber,
      panNumber,
      address,
      city,
      state,
      pinCode,
      department,
      employmentType,
      dateOfJoining,
      reportingTo,
      workLocation,
      shift,
      status,
      specialization,
      skills,
      emergencyContactName,
      emergencyRelationship,
      emergencyPhone,
      alternatePhone,
    } = req.body

    const electrician = await prisma.electrician.create({
      data: {
        employeeId,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phoneNumber,
        email: email || null,
        aadhaarNumber: aadhaarNumber || null,
        panNumber: panNumber || null,
        address,
        city,
        state,
        pinCode,
        department,
        employmentType,
        dateOfJoining: new Date(dateOfJoining),
        reportingTo,
        workLocation,
        shift: shift || null,
        status,
        specialization,
        skills,
        emergencyContactName,
        emergencyRelationship,
        emergencyPhone,
        alternatePhone: alternatePhone || null,
      },
    })

    res.status(201).json(electrician)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Employee ID already exists.' })
    }
    console.error('Failed to create electrician', err)
    res.status(500).json({ message: 'Failed to create electrician.' })
  }
}
