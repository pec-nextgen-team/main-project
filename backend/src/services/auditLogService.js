const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function createAuditLog({
  complaintId,
  userId,
  action,
  description,
  oldValue,
  newValue
}) {
  try {
    await prisma.auditLog.create({
      data: {
        complaintId,
        userId,
        action,
        description,
        oldValue,
        newValue
      }
    });
  } catch (error) {
    console.log("Audit log failed:", error.message);
  }
}

module.exports = {
  createAuditLog
};