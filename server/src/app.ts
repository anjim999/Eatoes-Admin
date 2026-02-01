import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/db';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Connect to Database
connectDB();

// Middleware
// Cors Configuration
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            config.corsOrigin,
            'https://eatoes-admin.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

export default app;
