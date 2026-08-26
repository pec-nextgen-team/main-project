const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

console.log('--- Database Check ---');
console.log('DATABASE_URL detected:', Boolean(process.env.DATABASE_URL));

// Configure PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test raw connection to Neon
pool.connect((err, client, release) => {
  if (err) {
    console.error('Connection Failed:', err.message);
  } else {
    console.log('Connected to Neon PostgreSQL successfully!');
    release();
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;