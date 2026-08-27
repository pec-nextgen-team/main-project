const prisma = require('../config/db');

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

module.exports = {
  createComplaint,
};
