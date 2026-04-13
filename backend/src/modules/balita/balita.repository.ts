import { prisma } from '../../config/db';
import { Balita, PemeriksaanBalita, Prisma } from '@prisma/client';

export class BalitaRepository {
  async findAll(): Promise<Balita[]> {
    return prisma.balita.findMany({
      include: {
        pemeriksaan: {
          orderBy: { tglUkur: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Balita | null> {
    return prisma.balita.findUnique({
      where: { id },
      include: { pemeriksaan: { orderBy: { tglUkur: 'desc' } } }
    });
  }

  async create(data: Prisma.BalitaCreateInput): Promise<Balita> {
    return prisma.balita.create({ data });
  }

  async update(id: number, data: Prisma.BalitaUpdateInput): Promise<Balita> {
    return prisma.balita.update({
      where: { id },
      data
    });
  }

  async addPemeriksaan(data: Prisma.PemeriksaanBalitaUncheckedCreateInput): Promise<PemeriksaanBalita> {
    return prisma.pemeriksaanBalita.create({ data });
  }
}
