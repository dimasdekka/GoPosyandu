import { prisma } from '../../config/db';

export class LaporanRepository {
  async getSummaryStats() {
    const [balita, ibuHamil, remaja, lansia] = await Promise.all([
      prisma.balita.count(),
      prisma.ibuHamil.count(),
      prisma.remaja.count(),
      prisma.lansia.count(),
    ]);

    return { balita, ibuHamil, remaja, lansia };
  }

  async getHealthDistributions() {
    // 1. Balita Status Gizi Distribution
    const balitaGizi = await prisma.pemeriksaanBalita.groupBy({
      by: ['statusGizi'],
      _count: { _all: true },
    });

    // 2. Ibu Hamil Status Risiko Distribution
    const bumilRisiko = await prisma.pemeriksaanIbuHamil.groupBy({
      by: ['statusRisiko'],
      _count: { _all: true },
    });

    // 3. Lansia Resiko PTM Distribution
    const lansiaPTM = await prisma.pemeriksaanLansia.groupBy({
      by: ['resikoPTM'],
      _count: { _all: true },
    });

    // 4. Remaja Status Gizi Distribution
    const remajaGizi = await prisma.pemeriksaanRemaja.groupBy({
      by: ['statusGizi'],
      _count: { _all: true },
    });

    return {
      balita: balitaGizi.map(i => ({ label: i.statusGizi, value: i._count._all })),
      ibuHamil: bumilRisiko.map(i => ({ label: i.statusRisiko, value: i._count._all })),
      lansia: lansiaPTM.map(i => ({ label: i.resikoPTM, value: i._count._all })),
      remaja: remajaGizi.map(i => ({ label: i.statusGizi, value: i._count._all })),
    };
  }

  async getMonthlyTrends() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Aggregate monthly checkups across all categories
    // This is a simplified version, in a real DB you'd use a more complex query or union
    const balitaTrends = await prisma.pemeriksaanBalita.findMany({
      where: { tglUkur: { gte: sixMonthsAgo } },
      select: { tglUkur: true }
    });

    const bumilTrends = await prisma.pemeriksaanIbuHamil.findMany({
      where: { tglPeriksa: { gte: sixMonthsAgo } },
      select: { tglPeriksa: true }
    });

    const lnsTrends = await prisma.pemeriksaanLansia.findMany({
      where: { tglPeriksa: { gte: sixMonthsAgo } },
      select: { tglPeriksa: true }
    });

    const rmjTrends = await prisma.pemeriksaanRemaja.findMany({
      where: { tglPeriksa: { gte: sixMonthsAgo } },
      select: { tglPeriksa: true }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const trendMap: Record<string, { total: number, timestamp: number }> = {};

    [
      ...balitaTrends.map((t: any) => t.tglUkur), 
      ...bumilTrends.map((t: any) => t.tglPeriksa),
      ...lnsTrends.map((t: any) => t.tglPeriksa),
      ...rmjTrends.map((t: any) => t.tglPeriksa)
    ].forEach((date: Date) => {
      const monthLabel = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (!trendMap[monthLabel]) {
        trendMap[monthLabel] = { total: 0, timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime() };
      }
      trendMap[monthLabel].total++;
    });

    return Object.entries(trendMap)
      .map(([name, data]) => ({ name, total: data.total, ts: data.timestamp }))
      .sort((a, b) => a.ts - b.ts);
  }

  async getRawData(category: string) {
    switch (category.toLowerCase()) {
      case 'balita':
        return prisma.balita.findMany({ include: { pemeriksaan: true } });
      case 'ibu-hamil':
        return prisma.ibuHamil.findMany({ include: { pemeriksaan: true } });
      case 'lansia':
        return prisma.lansia.findMany({ include: { pemeriksaan: true } });
      case 'remaja':
        return prisma.remaja.findMany({ include: { pemeriksaan: true } });
      case 'semua':
        const [blt, bml, lns, rmj] = await Promise.all([
            prisma.balita.findMany({ include: { pemeriksaan: true } }),
            prisma.ibuHamil.findMany({ include: { pemeriksaan: true } }),
            prisma.lansia.findMany({ include: { pemeriksaan: true } }),
            prisma.remaja.findMany({ include: { pemeriksaan: true } }),
        ]);
        return { balita: blt, ibuHamil: bml, lansia: lns, remaja: rmj };
      default:
        throw new Error("Category not found");
    }
  }
}
