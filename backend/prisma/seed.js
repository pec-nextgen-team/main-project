require("dotenv").config();

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma/client.ts");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("Test@123", 10);

  const users = [
    {
      employeeId: "SUP001",
      username: "supervisor1",
      passwordHash,
      fullName: "Test Supervisor",
      email: "supervisor1@test.com",
      role: "SUPERVISOR",
    },
    {
      employeeId: "HOD001",
      username: "hod1",
      passwordHash,
      fullName: "Test HOD",
      email: "hod1@test.com",
      role: "HOD",
    },
    {
      employeeId: "EH001",
      username: "electricianhead1",
      passwordHash,
      fullName: "Test Electrician Head",
      email: "electricianhead1@test.com",
      role: "ELECTRICIAN_HEAD",
    },
    {
      employeeId: "EL001",
      username: "electrician1",
      passwordHash,
      fullName: "Test Electrician 1",
      email: "electrician1@test.com",
      role: "ELECTRICIAN",
    },
    {
      employeeId: "EL002",
      username: "electrician2",
      passwordHash,
      fullName: "Test Electrician 2",
      email: "electrician2@test.com",
      role: "ELECTRICIAN",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { employeeId: user.employeeId },
      update: {
        username: user.username,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: true,
      },
      create: user,
    });
  }

  console.log("Seed completed successfully.");
  console.log("Created/updated 5 test users.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });