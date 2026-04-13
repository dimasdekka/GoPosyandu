import { Router } from 'express';
import { JadwalController } from './jadwal.controller';

export const jadwalRouter = Router();
const controller = new JadwalController();

jadwalRouter.get('/', controller.index);
jadwalRouter.get('/:id', controller.show);
jadwalRouter.post('/', controller.store);
jadwalRouter.patch('/:id/status', controller.updateStatus);
jadwalRouter.delete('/:id', controller.destroy);
