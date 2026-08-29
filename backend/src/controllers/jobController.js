const prisma = require('../config/db');

// POST /api/jobs/assign
// Assign an approved complaint to an electrician
const assignJob = async (req, res) => {
  try {
    const { complaintId, technicianId, remarks } = req.body;

    // Validate required fields
    if (!complaintId || !technicianId) {
      return res.status(400).json({
        success: false,
        message: 'complaintId and technicianId are required',
      });
    }

    // Verify technician exists and is an electrician
    const technician = await prisma.user.findUnique({
      where: {
        id: technicianId,
      },
      select: {
        id: true,
        employeeId: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!technician) {
      return res.status(400).json({
        success: false,
        message: 'Technician not found',
      });
    }

    if (technician.role !== 'ELECTRICIAN') {
      return res.status(400).json({
        success: false,
        message: 'Selected technician is not an ELECTRICIAN',
      });
    }

    if (!technician.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Selected technician is inactive',
      });
    }

    // Verify complaint exists and has HOD approval
    const complaint = await prisma.complaint.findUnique({
      where: {
        id: complaintId,
      },
      select: {
        id: true,
        ticketNumber: true,
        title: true,
        status: true,
        hodApprovalStatus: true,
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (complaint.hodApprovalStatus !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Complaint must be approved by HOD before assignment',
      });
    }

    // Prevent duplicate active assignment
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        complaintId,
        status: {
          in: ['ASSIGNED', 'IN_PROGRESS'],
        },
      },
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: 'Complaint is already assigned',
      });
    }

    // Create assignment and update complaint status
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.create({
        data: {
          complaintId,
          technicianId,
          assignedById: req.user.id,
          remarks: remarks || null,
          status: 'ASSIGNED',
        },
        include: {
          technician: {
            select: {
              id: true,
              employeeId: true,
              username: true,
              fullName: true,
              role: true,
            },
          },
          complaint: {
            select: {
              id: true,
              ticketNumber: true,
              title: true,
              status: true,
            },
          },
        },
      });

      await tx.complaint.update({
        where: {
          id: complaintId,
        },
        data: {
          status: 'REPAIR_ASSIGNED',
          lastUpdatedAt: new Date(),
        },
      });

      return assignment;
    });

    return res.status(201).json({
      success: true,
      message: 'Job assigned successfully',
      assignment: result,
    });
  } catch (error) {
    console.error('Assign job error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to assign job',
    });
  }
};


// GET /api/jobs
// Electrician views assigned jobs
const getJobs = async (req, res) => {
  try {
    const technicianId = req.user.id;

    const jobs = await prisma.assignment.findMany({
      where: {
        technicianId,
      },
      orderBy: {
        assignedAt: 'desc',
      },
      include: {
        complaint: {
          select: {
            id: true,
            ticketNumber: true,
            title: true,
            description: true,
            category: true,
            priority: true,
            status: true,
            slaDueAt: true,
            registeredAt: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Get jobs error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    });
  }
};


module.exports = {
  getJobs,
  assignJob,
};