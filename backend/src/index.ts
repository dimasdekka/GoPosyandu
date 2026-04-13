import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { balitaRouter } from './modules/balita/balita.route';
import { ibuHamilRouter } from './modules/ibu-hamil/ibu-hamil.route';
import { remajaRouter } from './modules/remaja/remaja.route';
import { lansiaRouter } from './modules/lansia/lansia.route';
import { jadwalRouter } from './modules/jadwal/jadwal.route';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SIPosyandu API is running' });
});

app.use('/api/v1/balita', balitaRouter);
app.use('/api/v1/ibu-hamil', ibuHamilRouter);
app.use('/api/v1/remaja', remajaRouter);
app.use('/api/v1/lansia', lansiaRouter);
app.use('/api/v1/jadwal', jadwalRouter);

// Basic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Server Initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
