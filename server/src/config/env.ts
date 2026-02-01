import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const config = {
    port: process.env.PORT as string,
    mongoUri: process.env.MONGODB_URI as string,
    nodeEnv: process.env.NODE_ENV as string,
    corsOrigin: process.env.CORS_ORIGIN as string,
};
