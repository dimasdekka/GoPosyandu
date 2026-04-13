import { IbuHamilRepository } from './ibu-hamil.repository';
import { Prisma } from '@prisma/client';

export class IbuHamilService {
  private repository = new IbuHamilRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getDetail(id: number) {
    const data = await this.repository.findById(id);
    if (!data) throw new Error('Data Ibu Hamil tidak ditemukan');
    return data;
  }

  async register(data: Prisma.IbuHamilCreateInput) {
    return this.repository.create(data);
  }

  async update(id: number, data: Prisma.IbuHamilUpdateInput) {
    await this.getDetail(id);
    return this.repository.update(id, data);
  }

  async recordPemeriksaan(ibuHamilId: number, data: Omit<Prisma.PemeriksaanIbuHamilUncheckedCreateInput, 'ibuHamilId'>) {
    await this.getDetail(ibuHamilId);
    return this.repository.addPemeriksaan({ ...data, ibuHamilId });
  }
}
