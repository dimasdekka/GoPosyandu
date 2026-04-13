import { prisma } from '../../config/db';
import { IbuHamil, PemeriksaanIbuHamil, Prisma } from '@prisma/client';

export class IbuHamilRepository {
  async findAll(): Promise<IbuHamil[]> {
    return prisma.ibuHamil.findMany({
      include: {
        pemeriksaan: { orderBy: { tglPeriksa: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<IbuHamil | null> {
    return prisma.ibuHamil.findUnique({
      where: { id },
      include: { pemeriksaan: { orderBy: { tglPeriksa: 'desc' } } }
    });
  }

  async create(data: Prisma.IbuHamilCreateInput): Promise<IbuHamil> {
    return prisma.ibuHamil.create({ data });
  }

  async update(id: number, data: Prisma.IbuHamilUpdateInput): Promise<IbuHamil> {
    return prisma.ibuHamil.update({ where: { id }, data });
  }

  async addPemeriksaan(data: Prisma.PemeriksaanIbuHamilUncheckedCreateInput): Promise<PemeriksaanIbuHamil> {
    return prisma.pemeriksaanIbuHamil.create({ data });
  }
}
