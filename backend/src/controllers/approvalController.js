const { hasConflict } = require('../services/authorizationService');
const { complaintTransaction } = require('../services/complaintTransaction');
const prisma = require('../config/db');
const { createAuditLog } = require('../services/auditLogService');
const { isHodAuthorizedForDepartmentComplaint } = require('./complaintController');
const closureService = require('../services/closureService');

exports.getPendingApprovals = async (req, res) => {
  const prisma = req.db || require('../config/db');
  try {
    if (!req.user.departmentId) {
      return res.status(200).json({
        success: true,
        count: 0,
        complaints: [],
      });
    }

    const complaints = await prisma.complaint.findMany({
      where: {
        hodApprovalStatus: 'PENDING',
        departmentId: req.user.departmentId,
        status: { notIn: ['CLOSED'] },
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
    console.error('Get Pending Approvals Error:',error);

   return res.status(500).json({
  success: false,
  message: 'Failed to fetch pending approvals.',
  error: error.message
});
  }
};

exports.getApprovalHistory = async (req, res) => {
  const prisma = req.db || require('../config/db');
  try {
    const hodId = req.user.id;
    const departmentId = req.user.departmentId;

    const complaints = await prisma.complaint.findMany({
      where: {
        departmentId: departmentId || '__no_department__',
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
        equipment: true,
        assignments: {
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
          },
          orderBy: {
            assignedAt: 'desc',
          },
        },
        atrs: {
          include: {
            submittedBy: {
              select: {
                id: true,
                fullName: true,
                employeeId: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
        verifications: true,
        statusHistory: {
          orderBy: {
            changedAt: 'desc',
          },
        },
        hodApprovedBy: {
          select: {
            id: true,
            fullName: true,
            employeeId: true,
          },
        },
      },
      orderBy: {
        lastUpdatedAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Get Approval History Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch approval history.',
    });
  }
};

exports.updateApproval = async (req, res) => {
  const prisma = req.db || require('../config/db');
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either APPROVED or REJECTED.',
      });
    }

    if (
      status === 'REJECTED' &&
      (!rejectionReason || !rejectionReason.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a complaint.',
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { assignments: true, atrs: true, verifications: true },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (!isHodAuthorizedForDepartmentComplaint(req.user, complaint)) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (hasConflict(req.user.id, complaint, { includeVerification: true })) return res.status(403).json({ success: false, message: 'You cannot approve your own complaint or conflicting repair work' });

    if (complaint.hodApprovalStatus !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'This complaint has already been processed.',
      });
    }

    if (['CLOSED', 'CANCELLED'].includes(complaint.status)) return res.status(409).json({ success: false, message: 'Terminal complaints cannot be changed.' });

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        hodApprovalStatus: status,
        hodApprovedById: req.user.id,
        hodApprovedAt: new Date(),
        hodRemarks:
          status === 'REJECTED'
            ? rejectionReason.trim()
            : (req.body.remarks || req.body.hodRemarks || null),
      },
    });
    await createAuditLog({
  complaintId: id,
  userId: req.user.id,
  action: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
  description: `Complaint ${status.toLowerCase()} by HOD`,
  oldValue: JSON.stringify({
    hodApprovalStatus: 'PENDING'
  }),
  newValue: JSON.stringify({
    hodApprovalStatus: status,
    rejectionReason: rejectionReason || null
  })
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

exports.getPendingActionReportApprovals = async (req, res) => {
  const prisma = req.db || require('../config/db');
  try {
    if (!req.user.departmentId) {
      return res.status(200).json({
        success: true,
        count: 0,
        complaints: [],
      });
    }

    const complaints = await prisma.complaint.findMany({
      where: {
        status: 'ACTION_TAKEN',
        departmentId: req.user.departmentId,
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
        assignments: {
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
          },
        },
        atrs: {
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
      orderBy: {
        lastUpdatedAt: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Get Pending Action Report Approvals Error:');

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending action-taken report approvals.',
    });
  }
};

exports.updateActionReportApproval = async (req, res) => {
  const prisma = req.db || require('../config/db');
  try {
    const { id } = req.params;
    const { status, remarks, rejectionReason } = req.body;
    const hodId = req.user.id;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either APPROVED or REJECTED.',
      });
    }

    const reason = (rejectionReason || remarks || '').trim();
    if (status === 'REJECTED' && !reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting an action-taken report.',
      });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        atrs: true,
        assignments: true,
        verifications: true,
        attachments: true,
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (!isHodAuthorizedForDepartmentComplaint(req.user, complaint)) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (complaint.status === 'CLOSED') {
      return res.status(409).json({
        success: false,
        message: 'This complaint is already closed and cannot be reopened through this endpoint.',
      });
    }

    if (hasConflict(hodId, complaint, { includeVerification: true })) return res.status(403).json({ success: false, message: 'You cannot endorse your own complaint or conflicting repair work' });
    const evidenceError = closureService.repairEvidenceViolation(complaint);
    if (evidenceError) return res.status(400).json({ success: false, message: evidenceError });

    const result = status === 'APPROVED'
      ? await prisma.$transaction(async (tx) => {
          const now = new Date();
          const { complaint: updatedComplaint } = await closureService.performClose(tx, {
            complaintId: id,
            closedById: hodId,
            remarks: remarks || 'HOD endorsed Action Taken Report and closed ticket.',
            verification: {
              remarks: remarks || 'HOD endorsed ATR and closed ticket',
              cycleNumber: complaint.currentCycle == null ? 1 : complaint.currentCycle,
            },
            complaintUpdateFields: {
              verifiedAt: now,
              resolvedAt: complaint.resolvedAt || now,
            },
          });
          return updatedComplaint;
        })
      : await prisma.$transaction(async (tx) => {
          const nextCycle = (complaint.currentCycle == null ? 1 : complaint.currentCycle) + 1;

          const rejectedComplaint = await tx.complaint.update({
            where: { id },
            data: {
              status: 'REPAIR_ASSIGNED',
              lastUpdatedAt: new Date(),
              currentCycle: nextCycle,
            },
          });

          await tx.complaintStatusHistory.create({
            data: {
              complaintId: id,
              status: 'REPAIR_ASSIGNED',
              remarks:
                reason ||
                `Action-taken report rejected. Ticket sent back for rework (cycle ${nextCycle}).`,
              changedById: hodId,
            },
          });

          return rejectedComplaint;
        });

    return res.status(200).json({
      success: true,
      message:
        status === 'APPROVED'
          ? 'Action-taken report endorsed successfully. Ticket is now closed.'
          : 'Action-taken report rejected. Ticket sent back for rework.',
      complaint: result,
    });
  } catch (error) {
    console.error('Update Action Report Approval Error:');
await createAuditLog({
  complaintId: id,
  userId: hodId,
  action: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
  description: `Action Taken Report ${status.toLowerCase()} by HOD`,
  oldValue: JSON.stringify({
    status: 'ACTION_TAKEN'
  }),
  newValue: JSON.stringify({
    status: status === 'APPROVED' ? 'CLOSED' : 'REPAIR_ASSIGNED',
    remarks: remarks || rejectionReason || null
  })
});
    return res.status(500).json({
      success: false,
      message: 'Failed to update action-taken report approval.',
    });
  }
};


// exports.updateApproval = complaintTransaction(exports.updateApproval);
// exports.updateActionReportApproval = complaintTransaction(exports.updateActionReportApproval);
