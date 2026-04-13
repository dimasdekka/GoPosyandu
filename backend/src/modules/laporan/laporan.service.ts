import { LaporanRepository } from './laporan.repository';

export class LaporanService {
  private repository = new LaporanRepository();

  async getDashboardStats() {
    const summary = await this.repository.getSummaryStats();
    const distributions = await this.repository.getHealthDistributions();
    const trends = await this.repository.getMonthlyTrends();

    return {
      summary,
      distributions,
      trends
    };
  }

  async getExportData(category: string) {
    return this.repository.getRawData(category);
  }
}
