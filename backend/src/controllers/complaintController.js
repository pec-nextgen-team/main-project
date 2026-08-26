const prisma = require('../config/db');

const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      reporterId,
      departmentId,
      equipmentId,
      slaDueAt,
    } = req.body;

    if (!title || !description || !category || !reporterId || !slaDueAt) {
      return res.status(400).json({
        status: 'error',
        message:
          'title, description, category, reporterId and slaDueAt are required',
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