import { Request, Response, NextFunction } from 'express';
import { BalitaService } from './balita.service';
import { z } from 'zod';

const balitaService = new BalitaService();

// Zod validations mimicking frontend behavior exactly
const createBalitaSchema = z.object({
  nama: z.string().min(2),
  tglLahir: z.string().transform((str) => new Date(str)),
  jk: z.enum(['L', 'P']),
  ibu: z.string().min(2),
  ayah: z.string().min(2),
  alamat: z.string().min(5),
});

const pemeriksaanBalitaSchema = z.object({
  bb: z.number().positive(),
  tb: z.number().positive().optional(),
  statusGizi: z.string().min(2),
});

export class BalitaController {
  
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await balitaService.getAllBalita();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await balitaService.getBalitaDetail(id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createBalitaSchema.parse(req.body);
      const result = await balitaService.registerBalita(validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      next(error);
    }
  }

  async storePemeriksaan(req: Request, res: Response, next: NextFunction) {
    try {
      const balitaId = parseInt(req.params.id);
      const validatedData = pemeriksaanBalitaSchema.parse(req.body);
      const result = await balitaService.recordPemeriksaan(balitaId, validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      next(error);
    }
  }
}
