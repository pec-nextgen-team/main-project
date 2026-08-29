const prisma = require('../config/db');

// POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      departmentId,
      equipmentId,
      slaDueAt,
    } = req.body;

    const reporterId = req.user.id;

    if (!title || !description || !category || !slaDueAt) {
      return res.status(400).json({
        status: 'error',
        message: 'title, description, category and slaDueAt are required',
      });
    }

    const ticketNumber = `CMP-${Date.now()}`;

    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        title,
        description,
        category,
        priority: priority || 'MEDIUM',
        reporterId,
        departmentId: departmentId || null,
        equipmentId: equipmentId || null,
        slaDueAt: new Date(slaDueAt),
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Complaint created successfully',
      data: complaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to create complaint',
      error: error.message,
    });
  }
};


// GET /api/complaints
// Supervisor can view complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            employeeId: true,
            username: true,
            fullName: true,
          },
        },
        department: true,
        equipment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      status: 'success',
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Get complaints error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
};


// GET /api/complaints/my
// Supervisor can view only complaints they created
const getMyComplaints = async (req, res) => {
  try {
    const reporterId = req.user.id;

    const complaints = await prisma.complaint.findMany({
      where: {
        reporterId,
      },
      include: {
        department: true,
        equipment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      status: 'success',
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Get my complaints error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch your complaints',
      error: error.message,
    });
  }
};


// PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      priority,
      departmentId,
      equipmentId,
      slaDueAt,
    } = req.body;

    // Find complaint first
    const existingComplaint = await prisma.complaint.findUnique({
      where: {
        id,
      },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found',
      });
    }

    // Only the person who created the complaint can update it
    if (existingComplaint.reporterId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update complaints you created',
      });
    }

    // Don't allow updating complaints after HOD processing
    if (existingComplaint.hodApprovalStatus !== 'PENDING') {
      return res.status(400).json({
        status: 'error',
        message: 'Only pending complaints can be updated',
      });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(priority !== undefined && { priority }),
        ...(departmentId !== undefined && { departmentId }),
        ...(equipmentId !== undefined && { equipmentId }),
        ...(slaDueAt !== undefined && {
          slaDueAt: new Date(slaDueAt),
        }),
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Complaint updated successfully',
      data: updatedComplaint,
    });
  } catch (error) {
    console.error('Update complaint error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to update complaint',
      error: error.message,
    });
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaint,
};