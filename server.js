// server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.js';
import path from 'path';
import { fileURLToPath } from 'url';

import authMiddleware from './middleware/auth_middleware.js';
import errorMiddleware from './middleware/error_middleware.js';

import businessRoutes from './routes/business.js';
import adminRoutes from './routes/admin.js';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to the database
connectDB();

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/business', businessRoutes);
app.use('/api/admin', adminRoutes);

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Example route to check API status
app.get('/', (req, res) => {
    res.send('Fleetwood Plumbing API is running...');
});

// Error handling middleware should be the last middleware
app.use(errorMiddleware);

// Handle 404 errors
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});