import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Import configs & helpers
import { connectDatabase } from './config/database';
import { cache } from './config/redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Load Environment Variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*', // Customize this for production
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Customize this for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiter for general endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO namespaces / connection event
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Basic Health Check Route
app.get('/api/health', async (_req, res, next) => {
  try {
    const isDbConnected = await connectDatabase().then(() => true).catch(() => false);
    const isRedisUsing = cache.isUsingRedis();

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected',
      cache: isRedisUsing ? 'redis' : 'in-memory-fallback',
    });
  } catch (error) {
    next(error);
  }
});

// API Routes
import apiRoutes from './routes';
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server & Database
const startServer = async () => {
  try {
    // Attempt database connection on startup
    await connectDatabase().catch((err) => {
      logger.error(`Database initialization skipped on startup due to: ${err.message}`);
    });

    server.listen(PORT, () => {
      logger.info(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();

export { app, server, io };
