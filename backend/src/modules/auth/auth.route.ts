import { Router } from 'express';
import { AuthController } from './auth.controller';

export const authRouter = Router();
const controller = new AuthController();

authRouter.post('/login', controller.login);
authRouter.post('/register', controller.register);
