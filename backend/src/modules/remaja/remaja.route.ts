import { Router } from 'express';
import { RemajaController } from './remaja.controller';

export const remajaRouter = Router();
const controller = new RemajaController();

remajaRouter.get('/', controller.index);
remajaRouter.get('/:id', controller.show);
remajaRouter.post('/', controller.store);
remajaRouter.patch('/:id', controller.update);
remajaRouter.post('/:id/pemeriksaan', controller.storePemeriksaan);
