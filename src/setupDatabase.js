import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function setupDatabase() {
  await client.connect();

  await client.query(`
    CREATE TYPE "Role" AS ENUM (
      'SUPERVISOR',
      'HOD',
      'ELECTRICIAN_HEAD',
      'ELECTRICIAN'
    );

    CREATE TYPE "ComplaintStatus" AS ENUM (
      'DRAFT',
      'PENDING_HOD_APPROVAL',
      'APPROVED',
      'REJECTED'
    );

    CREATE TYPE "TicketStatus" AS ENUM (
      'TICKET_OPEN',
      'ASSIGNED'
    );

    CREATE TYPE "ComplaintCategory" AS ENUM (
      'ELECTRICAL',
      'PLUMBING',
      'MAINTENANCE'
    );

    CREATE TYPE "Priority" AS ENUM (
      'HIGH',
      'MEDIUM',
      'LOW'
    );

    CREATE TABLE "User" (
      "id" SERIAL PRIMARY KEY,
      "identifier" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "role" "Role" NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "Complaint" (
      "id" SERIAL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "category" "ComplaintCategory" NOT NULL,
      "location" TEXT NOT NULL,
      "priority" "Priority" NOT NULL,
      "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING_HOD_APPROVAL',
      "creatorId" INTEGER NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "Complaint_creatorId_fkey"
        FOREIGN KEY ("creatorId")
        REFERENCES "User"("id")
    );

    CREATE TABLE "Ticket" (
      "id" SERIAL PRIMARY KEY,
      "complaintId" INTEGER NOT NULL UNIQUE,
      "status" "TicketStatus" NOT NULL DEFAULT 'TICKET_OPEN',
      "assignedElectricianId" INTEGER,
      "assignedAt" TIMESTAMP(3),
      "slaTarget" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "Ticket_complaintId_fkey"
        FOREIGN KEY ("complaintId")
        REFERENCES "Complaint"("id"),

      CONSTRAINT "Ticket_assignedElectricianId_fkey"
        FOREIGN KEY ("assignedElectricianId")
        REFERENCES "User"("id")
    );

    CREATE INDEX "Complaint_status_idx"
      ON "Complaint"("status");

    CREATE INDEX "Complaint_creatorId_idx"
      ON "Complaint"("creatorId");

    CREATE INDEX "Ticket_status_idx"
      ON "Ticket"("status");

    CREATE INDEX "Ticket_assignedElectricianId_idx"
      ON "Ticket"("assignedElectricianId");
  `);

  console.log("Database tables created successfully.");

  await client.end();
}

setupDatabase().catch(async (error) => {
  console.error("Database setup failed:", error);
  await client.end();
  process.exit(1);
});