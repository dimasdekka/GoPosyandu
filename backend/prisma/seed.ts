import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';

// Prisma v7 requires a driver adapter. PrismaMariaDb supports mysql:// URLs.
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const kaderPassword = await bcrypt.hash('kader123', 10);

  // Admin Init
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama: 'Budi Administrator',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Kader Init
  const kader = await prisma.user.upsert({
    where: { username: 'kader' },
    update: {},
    create: {
      nama: 'Kader Nambo',
      username: 'kader',
      password: kaderPassword,
      role: 'KADER',
    },
  });

  console.log('🌱 Database has been seeded:');
  console.log({ admin, kader });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
