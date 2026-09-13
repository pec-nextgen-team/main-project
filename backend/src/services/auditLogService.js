const prisma = require('../config/db');

async function createAuditLog({
  complaintId,
  userId,
  action,
  description,
  oldValue,
  newValue,
}) {
  try {
    await prisma.auditLog.create({
      data: {
        complaintId,
        userId,
        action,
        description,
        oldValue,
        newValue,
      },
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
}

module.exports = {
  createAuditLog,
};