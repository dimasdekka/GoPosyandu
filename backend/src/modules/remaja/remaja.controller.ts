import { Request, Response, NextFunction } from 'express';
import { RemajaService } from './remaja.service';
import { z } from 'zod';

const service = new RemajaService();

const createSchema = z.object({
  nama: z.string().min(2),
  umur: z.number().int().positive(),
  sekolah: z.string().min(2),
  alamat: z.string().min(5),
});

const pemeriksaanSchema = z.object({
  bb: z.number().positive().optional(),
  tensiSistolik: z.number().int().positive().optional(),
  tensiDiastolik: z.number().int().positive().optional(),
  statusGizi: z.string(),
  catatanEdukasi: z.string().optional(),
});

export class RemajaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getAll();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await service.getDetail(id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createSchema.parse(req.body);
      const result = await service.register(validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
      next(error);
    }
  }

  async storePemeriksaan(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const validatedData = pemeriksaanSchema.parse(req.body);
      const result = await service.recordPemeriksaan(id, validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.errors });
      next(error);
    }
  }
}
