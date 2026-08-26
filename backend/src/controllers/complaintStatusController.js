const prisma = require('../config/db');

const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, remarks, changedById } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'status is required',
      });
    }

    const validStatuses = [
      'COMPLAINT_REGISTERED',
      'INSPECTION',
      'REPAIR_ASSIGNED',
      'ACTION_TAKEN',
      'VERIFICATION',
      'CLOSED',
      'OVERDUE',
      'ESCALATED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid complaint status',
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: {
        id: complaintId,
      },
    });

    if (!complaint) {
      return res.status(404).json({
        status: 'error',
        message: 'Complaint not found',
      });
    }

    const updatedComplaint = await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: {
          id: complaintId,
        },
        data: {
          status,
          lastUpdatedAt: new Date(),
          ...(status === 'CLOSED' && {
            closedAt: new Date(),
          }),
        },
      });

      await tx.complaintStatusHistory.create({
        data: {
          complaintId,
          status,
          remarks: remarks || null,
          changedById: changedById || null,
        },
      });

      return updated;
    });

    return res.status(200).json({
      status: 'success',
      message: 'Complaint status updated successfully',
      data: updatedComplaint,
    });
  } catch (error) {
    console.error('Update complaint status error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to update complaint status',
      error: error.message,
    });
  }
};

module.exports = {
  updateComplaintStatus,
};