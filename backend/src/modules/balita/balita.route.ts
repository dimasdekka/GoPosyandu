import { Router } from 'express';
import { BalitaController } from './balita.controller';

export const balitaRouter = Router();
const controller = new BalitaController();

balitaRouter.get('/', controller.index);
balitaRouter.get('/:id', controller.show);
balitaRouter.post('/', controller.store);
balitaRouter.patch('/:id', controller.update);
balitaRouter.post('/:id/pemeriksaan', controller.storePemeriksaan);
