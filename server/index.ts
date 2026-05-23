import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import aiRouter from './routes/ai.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import dataRouter from './routes/data.js';

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local')
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(new Date().toISOString() + ' - ' + req.method + ' ' + req.path);
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);

// Serve static files from dist (frontend build)
const distPath = path.join(__dirname, '..');
app.use(express.static(distPath));

// Fallback for SPA
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err instanceof Error ? err.message : 'Internal Server Error'
  });
});

// Init DB then start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server running on http://localhost:' + PORT);
      console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
      console.log('Database: MySQL @ ' + (process.env.DB_HOST || 'localhost') + ':' + (process.env.DB_PORT || 3306));
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
