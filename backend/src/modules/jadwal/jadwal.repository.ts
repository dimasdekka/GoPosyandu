import { prisma } from '../../config/db';
import { Prisma, Jadwal } from '@prisma/client';

export class JadwalRepository {
  async findAll(): Promise<Jadwal[]> {
    return prisma.jadwal.findMany({
      orderBy: { tanggal: 'asc' }
    });
  }

  async create(data: Prisma.JadwalCreateInput): Promise<Jadwal> {
    return prisma.jadwal.create({ data });
  }

  async update(id: number, data: Prisma.JadwalUpdateInput): Promise<Jadwal> {
    return prisma.jadwal.update({ where: { id }, data });
  }
}
