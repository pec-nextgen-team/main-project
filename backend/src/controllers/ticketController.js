const prisma = require('../config/db');

// Open an approved complaint as an assignment/ticket
const openTicket = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: 'Complaint ID is required',
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        assignments: true,
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (complaint.status !== 'COMPLAINT_REGISTERED') {
      return res.status(400).json({
        success: false,
        message: 'Complaint is not available for assignment',
      });
    }

    if (complaint.assignments.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Assignment already exists for this complaint',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint is ready for assignment',
      complaint,
    });
  } catch (error) {
    console.error('Open ticket error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to open ticket',
    });
  }
};


// Get available electricians
const getElectricians = async (req, res) => {
  try {
    const electricians = await prisma.user.findMany({
      where: {
        role: 'ELECTRICIAN',
        isActive: true,
      },
      select: {
        id: true,
        employeeId: true,
        username: true,
        fullName: true,
        role: true,
        departmentId: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      electricians,
    });
  } catch (error) {
    console.error('Get electricians error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch electricians',
    });
  }
};


// Assign an electrician to a complaint
const assignElectrician = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { electricianId, remarks } = req.body;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: 'Complaint ID is required',
      });
    }

    if (!electricianId) {
      return res.status(400).json({
        success: false,
        message: 'electricianId is required',
      });
    }

    const electrician = await prisma.user.findUnique({
      where: {
        id: electricianId,
      },
    });

    if (!electrician) {
      return res.status(404).json({
        success: false,
        message: 'Electrician not found',
      });
    }

    if (electrician.role !== 'ELECTRICIAN' || !electrician.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not an active ELECTRICIAN',
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: {
        id: complaintId,
      },
      include: {
        assignments: true,
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (complaint.assignments.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Complaint is already assigned',
      });
    }

    const assignment = await prisma.assignment.create({
      data: {
        complaintId: complaint.id,
        technicianId: electrician.id,
        assignedById: req.user.userId,
        status: 'ASSIGNED',
        remarks: remarks || null,
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
        complaint: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Electrician assigned successfully',
      assignment,
    });
  } catch (error) {
    console.error('Assign electrician error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to assign electrician',
    });
  }
};

module.exports = {
  openTicket,
  getElectricians,
  assignElectrician,
};