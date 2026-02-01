import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env';
import { connectDB } from './config/db';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Connect to Database
connectDB();

// Middleware
// Cors Configuration
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

export default app;

