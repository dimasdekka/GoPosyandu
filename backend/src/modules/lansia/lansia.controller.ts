import { Request, Response, NextFunction } from 'express';
import { LansiaService } from './lansia.service';
import { z } from 'zod';

const service = new LansiaService();

const createSchema = z.object({
  nama: z.string().min(2),
  umur: z.number().int().positive(),
  jk: z.enum(['L', 'P']),
  alamat: z.string().min(5),
});

const pemeriksaanSchema = z.object({
  bb: z.number().positive().optional(),
  tb: z.number().positive().optional(),
  tensiSistolik: z.number().int().positive().optional(),
  tensiDiastolik: z.number().int().positive().optional(),
  gulaDarah: z.number().int().positive().optional(),
  asamUrat: z.number().positive().optional(),
  kolesterol: z.number().int().positive().optional(),
  keluhan: z.string().optional(),
  resikoPTM: z.enum(['Rendah', 'Sedang', 'Tinggi']),
});

export class LansiaController {
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
      const id = parseInt(req.params.id as string);
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
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const validatedData = createSchema.partial().parse(req.body);
      const result = await service.updateLansia(id, validatedData);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
      next(error);
    }
  }

  async storePemeriksaan(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const validatedData = pemeriksaanSchema.parse(req.body);
      const result = await service.recordPemeriksaan(id, validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
      next(error);
    }
  }
}
