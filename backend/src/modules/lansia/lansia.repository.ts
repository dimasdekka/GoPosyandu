import { prisma } from '../../config/db';
import { Lansia, PemeriksaanLansia, Prisma } from '@prisma/client';

export class LansiaRepository {
  async findAll(): Promise<Lansia[]> {
    return prisma.lansia.findMany({
      include: { pemeriksaan: { orderBy: { tglPeriksa: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Lansia | null> {
    return prisma.lansia.findUnique({
      where: { id },
      include: { pemeriksaan: { orderBy: { tglPeriksa: 'desc' } } }
    });
  }

  async create(data: Prisma.LansiaCreateInput): Promise<Lansia> {
    return prisma.lansia.create({ data });
  }

  async update(id: number, data: Prisma.LansiaUpdateInput): Promise<Lansia> {
    return prisma.lansia.update({
      where: { id },
      data
    });
  }

  async addPemeriksaan(data: Prisma.PemeriksaanLansiaUncheckedCreateInput): Promise<PemeriksaanLansia> {
    return prisma.pemeriksaanLansia.create({ data });
  }
}
