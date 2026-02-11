import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import compilerRoutes from './routes/compilerRoutes.js';
import snippetRoutes from './routes/snippetRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config({ path: "./.env" });

console.log("ENV CHECK MONGO_URI =", process.env.MONGO_URI);


// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Apply general rate limiting
app.use('/api/', apiLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online Code Compiler API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/snippets', snippetRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});