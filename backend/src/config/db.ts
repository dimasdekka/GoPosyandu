import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Successfully connected to Database');
  } catch (error) {
    console.error('❌ Database connection failed', error);
    process.exit(1);
  }
};
