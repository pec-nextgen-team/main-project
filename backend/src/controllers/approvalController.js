const prisma = require('../config/db');

// GET /api/approvals/pending
// HOD only
exports.getPendingApprovals = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: {
        hodApprovalStatus: 'PENDING',
      },
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
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Get Pending Approvals Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals.',
    });
  }
};


// PATCH /api/approvals/:id
// HOD only
exports.updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either APPROVED or REJECTED.',
      });
    }

    // Rejection requires a reason
    if (
      status === 'REJECTED' &&
      (!rejectionReason || !rejectionReason.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a complaint.',
      });
    }

    // Find complaint
    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Only pending complaints can be approved/rejected
    if (complaint.hodApprovalStatus !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'This complaint has already been processed.',
      });
    }

    // Update approval
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        hodApprovalStatus: status,
        hodApprovedById: req.user.userId,
        hodApprovedAt: new Date(),
        hodRemarks:
          status === 'REJECTED'
            ? rejectionReason.trim()
            : null,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        status === 'APPROVED'
          ? 'Complaint approved successfully.'
          : 'Complaint rejected successfully.',
      complaint: updatedComplaint,
    });

  } catch (error) {
    console.error('Update Approval Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint approval.',
    });
  }
};