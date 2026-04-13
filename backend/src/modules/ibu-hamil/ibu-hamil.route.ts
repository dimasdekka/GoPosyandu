import { Router } from 'express';
import { IbuHamilController } from './ibu-hamil.controller';

export const ibuHamilRouter = Router();
const controller = new IbuHamilController();

ibuHamilRouter.get('/', controller.index);
ibuHamilRouter.get('/:id', controller.show);
ibuHamilRouter.post('/', controller.store);
ibuHamilRouter.patch('/:id', controller.update);
ibuHamilRouter.post('/:id/pemeriksaan', controller.storePemeriksaan);
