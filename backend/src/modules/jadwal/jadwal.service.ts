import { JadwalRepository } from './jadwal.repository';
import { Prisma } from '@prisma/client';

export class JadwalService {
  private repository = new JadwalRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async createJadwal(data: Prisma.JadwalCreateInput) {
    return this.repository.create(data);
  }

  async updateStatus(id: number, status: string) {
    return this.repository.update(id, { status });
  }
}
