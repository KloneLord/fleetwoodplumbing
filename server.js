import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.js'; // Database connection
import authCodeRoutes from './routes/auth_codes.js'; // Routes for authentication codes
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to the database
connectDB();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example base route
app.get('/', (req, res) => {
    res.send('Fleetwood Plumbing API is running...');
});

// API Routes
app.use('/api/auth_codes', authCodeRoutes);

// Catch-all 404 middleware for undefined routes
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Global error handler middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
