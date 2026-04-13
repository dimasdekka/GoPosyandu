import { Request, Response, NextFunction } from 'express';
import { LaporanService } from './laporan.service';

const service = new LaporanService();

export class LaporanController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getDashboardStats();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async exportData(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const data = await service.getExportData(String(category));
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
