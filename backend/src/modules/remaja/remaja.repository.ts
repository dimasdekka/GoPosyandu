import { prisma } from '../../config/db';
import { Remaja, PemeriksaanRemaja, Prisma } from '@prisma/client';

export class RemajaRepository {
  async findAll(): Promise<Remaja[]> {
    return prisma.remaja.findMany({
      include: { pemeriksaan: { orderBy: { tglPeriksa: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Remaja | null> {
    return prisma.remaja.findUnique({
      where: { id },
      include: { pemeriksaan: { orderBy: { tglPeriksa: 'desc' } } }
    });
  }

  async create(data: Prisma.RemajaCreateInput): Promise<Remaja> {
    return prisma.remaja.create({ data });
  }

  async addPemeriksaan(data: Prisma.PemeriksaanRemajaUncheckedCreateInput): Promise<PemeriksaanRemaja> {
    return prisma.pemeriksaanRemaja.create({ data });
  }
}
