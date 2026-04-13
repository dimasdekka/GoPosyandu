import { Router } from 'express';
import { LansiaController } from './lansia.controller';

export const lansiaRouter = Router();
const controller = new LansiaController();

lansiaRouter.get('/', controller.index);
lansiaRouter.get('/:id', controller.show);
lansiaRouter.post('/', controller.store);
lansiaRouter.post('/:id/pemeriksaan', controller.storePemeriksaan);
