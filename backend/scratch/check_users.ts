import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

async function check() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true }
    });
    console.log("Existing Users:", JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
