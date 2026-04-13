import { RemajaRepository } from './remaja.repository';
import { Prisma } from '@prisma/client';

export class RemajaService {
  private repository = new RemajaRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getDetail(id: number) {
    const data = await this.repository.findById(id);
    if (!data) throw new Error('Data Remaja tidak ditemukan');
    return data;
  }

  async register(data: Prisma.RemajaCreateInput) {
    return this.repository.create(data);
  }

  async updateRemaja(id: number, data: Prisma.RemajaUpdateInput) {
    await this.getDetail(id);
    return this.repository.update(id, data);
  }

  async recordPemeriksaan(remajaId: number, data: Omit<Prisma.PemeriksaanRemajaUncheckedCreateInput, 'remajaId'>) {
    await this.getDetail(remajaId);
    return this.repository.addPemeriksaan({ ...data, remajaId });
  }
}
