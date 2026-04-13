import { Router } from 'express';
import { BalitaController } from './balita.controller';

export const balitaRouter = Router();
const controller = new BalitaController();

balitaRouter.get('/', controller.index);
balitaRouter.get('/:id', controller.show);
balitaRouter.post('/', controller.store);
balitaRouter.post('/:id/pemeriksaan', controller.storePemeriksaan);
