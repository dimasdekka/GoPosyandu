import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Prisma v7 requires a driver adapter. PrismaMariaDb supports mysql:// URLs.
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Database connected successfully (MySQL via Laragon)');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
