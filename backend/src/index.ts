import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { balitaRouter } from './modules/balita/balita.route';
import { ibuHamilRouter } from './modules/ibu-hamil/ibu-hamil.route';
import { remajaRouter } from './modules/remaja/remaja.route';
import { lansiaRouter } from './modules/lansia/lansia.route';
import { jadwalRouter } from './modules/jadwal/jadwal.route';
import { authRouter } from './modules/auth/auth.route';
import { authenticateToken } from './middlewares/auth.middleware';


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

// Public Route
app.use('/api/v1/auth', authRouter);

// Protected Routes
app.use('/api/v1/balita', balitaRouter);
app.use('/api/v1/ibu-hamil', ibuHamilRouter);
app.use('/api/v1/remaja', remajaRouter);
app.use('/api/v1/lansia', lansiaRouter);
app.use('/api/v1/jadwal', jadwalRouter);

// Basic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  require('fs').appendFileSync('error.log', err.stack + "\n\n" + JSON.stringify(err) + "\n\n");
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message, stack: err.stack });
});

// Server Initialization and Global Handlers
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
