import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import protectedRoutes from './routes/protected.js';
import errorHandler from './middleware/errorHandler.js';

// Load .env only in local development; Vercel provides env vars from the dashboard
if (process.env.NODE_ENV !== 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || false)
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});

// MongoDB Connection with better options for Vercel serverless
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/login_db', {
  serverSelectionTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  waitQueueTimeoutMS: 60000
})
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't crash - serverless functions can retry
  });

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/protected', protectedRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const uri = process.env.MONGODB_URI || 'NOT SET';
  const hasUri = uri !== 'NOT SET';
  const startsCorrectly = uri.startsWith('mongodb+srv://');

  let testResult = null;
  if (hasUri && mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      testResult = 'reconnect success';
    } catch (err) {
      testResult = err.message;
    }
  }

  res.json({
    status: 'OK',
    dbState: mongoose.connection.readyState,
    uriSet: hasUri,
    uriFormat: startsCorrectly ? 'OK' : 'WRONG FORMAT',
    testResult
  });
});

// Error handler
app.use(errorHandler);

// Export for Vercel serverless
export default app;

// Start server only in local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
