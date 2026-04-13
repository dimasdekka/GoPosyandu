import { Request, Response, NextFunction } from 'express';
import { JadwalService } from './jadwal.service';
import { z } from 'zod';

const service = new JadwalService();

const createSchema = z.object({
  tema: z.string().min(2),
  tanggal: z.string().transform(str => new Date(str)),
  waktu: z.string().min(3),
  lokasi: z.string().min(3),
});

export class JadwalController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getAll();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createSchema.parse(req.body);
      const result = await service.createJadwal(validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const { status } = req.body;
      const result = await service.updateStatus(id, String(status));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const result = await service.getById(id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      await service.deleteJadwal(id);
      res.json({ success: true, message: "Jadwal deleted" });
    } catch (error) {
      next(error);
    }
  }
}
