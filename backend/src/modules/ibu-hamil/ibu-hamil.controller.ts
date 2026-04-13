import { Request, Response, NextFunction } from 'express';
import { IbuHamilService } from './ibu-hamil.service';
import { z } from 'zod';

const service = new IbuHamilService();

const createSchema = z.object({
  nama: z.string().min(2),
  tglLahir: z.string().transform(str => new Date(str)),
  hpht: z.string().transform(str => new Date(str)),
  suami: z.string().min(2),
  alamat: z.string().min(5),
  noTelepon: z.string().min(10),
});

const pemeriksaanSchema = z.object({
  usiaKandungan: z.number().int().positive(),
  tensiSistolik: z.number().int().positive().optional(),
  tensiDiastolik: z.number().int().positive().optional(),
  bb: z.number().positive().optional(),
  statusRisiko: z.string(),
});

export class IbuHamilController {
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
