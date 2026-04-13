import { LansiaRepository } from './lansia.repository';
import { Prisma } from '@prisma/client';

export class LansiaService {
  private repository = new LansiaRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getDetail(id: number) {
    const data = await this.repository.findById(id);
    if (!data) throw new Error('Data Lansia tidak ditemukan');
    return data;
  }

  async register(data: Prisma.LansiaCreateInput) {
    return this.repository.create(data);
  }

  async updateLansia(id: number, data: Prisma.LansiaUpdateInput) {
    await this.getDetail(id);
    return this.repository.update(id, data);
  }

  async recordPemeriksaan(lansiaId: number, data: Omit<Prisma.PemeriksaanLansiaUncheckedCreateInput, 'lansiaId'>) {
    await this.getDetail(lansiaId);
    return this.repository.addPemeriksaan({ ...data, lansiaId });
  }
}
