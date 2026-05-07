import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import authRoutes from './backend/src/routes/authRoutes.ts';
import projectRoutes from './backend/src/routes/projectRoutes.ts';
import taskRoutes from './backend/src/routes/taskRoutes.ts';
import dashboardRoutes from './backend/src/routes/dashboardRoutes.ts';

// Middleware
import { errorHandler } from './backend/src/middleware/error.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // MongoDB Connection
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teamtask';
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Error Handler
  app.use(errorHandler);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
