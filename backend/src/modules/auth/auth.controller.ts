import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { z } from 'zod';

const service = new AuthService();

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  nama: z.string().min(2),
  role: z.enum(['ADMIN', 'KADER', 'PUSKESMAS', 'MASYARAKAT']).optional(),
});

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await service.login(validatedData.username, validatedData.password);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
      
      // Handle known service errors
      if (error instanceof Error && error.message.includes('salah')) {
         return res.status(401).json({ success: false, message: error.message });
      }

      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await service.register(validatedData as any);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
      
      if (error instanceof Error && error.message.includes('sudah digunakan')) {
        return res.status(409).json({ success: false, message: error.message });
      }

      next(error);
    }
  }
}
