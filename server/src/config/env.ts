import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
// Load environment variables from .env file
dotenv.config();

export const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    corsOrigin: process.env.CORS_ORIGIN,
};
