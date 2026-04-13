import { BalitaRepository } from './balita.repository';
import { Prisma } from '@prisma/client';

export class BalitaService {
  private repository: BalitaRepository;

  constructor() {
    this.repository = new BalitaRepository();
  }

  async getAllBalita() {
    return this.repository.findAll();
  }

  async getBalitaDetail(id: number) {
    const balita = await this.repository.findById(id);
    if (!balita) throw new Error('Data Balita tidak ditemukan');
    
    // In a real app we might calculate "usiaBulan" dynamically here based on balita.tglLahir
    // const diffTime = Math.abs(new Date().getTime() - balita.tglLahir.getTime());
    // const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    return balita;
  }

  async registerBalita(data: Prisma.BalitaCreateInput) {
    // Here we can place Zod parsing validations or assume controller validates it
    return this.repository.create(data);
  }

  async recordPemeriksaan(balitaId: number, data: Omit<Prisma.PemeriksaanBalitaUncheckedCreateInput, 'balitaId'>) {
    // Validasi apakah balita ada
    await this.getBalitaDetail(balitaId);
    
    return this.repository.addPemeriksaan({ ...data, balitaId });
  }
}
