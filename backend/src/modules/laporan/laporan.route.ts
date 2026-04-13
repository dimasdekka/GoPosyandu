import { Router } from 'express';
import { LaporanController } from './laporan.controller';

export const laporanRouter = Router();
const controller = new LaporanController();

laporanRouter.get('/stats', controller.getStats);
laporanRouter.get('/export/:category', controller.exportData);
