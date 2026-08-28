import { PrismaClient } from '@prisma/client'

// Reuse a single PrismaClient instance across hot reloads in dev.
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
