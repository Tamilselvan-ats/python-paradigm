// ============================================================================
// DSA Mastery - Express Backend Server
// Handles AI integration (Gemini) and code compilation endpoints
// ============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.js';
import compilerRoutes from './routes/compiler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// CORS - allow requests from the Next.js frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON request bodies (limit 5MB for code submissions)
app.use(express.json({ limit: '5mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// AI routes - Gemini integration
app.use('/api/ai', aiRoutes);

// Compiler routes - code execution & analysis
app.use('/api/compiler', compilerRoutes);

// ---------------------------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ---------------------------------------------------------------------------
// Global Error Handling Middleware
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║       DSA Mastery Backend Server         ║
  ║──────────────────────────────────────────║
  ║  🚀 Running on http://localhost:${PORT}     ║
  ║  📡 API Base: /api                       ║
  ║  🤖 AI Routes: /api/ai/*                ║
  ║  ⚙️  Compiler: /api/compiler/*            ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
