import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sessionMiddleware from './middleware/session_middleware.js';
import businessRoutes from './routes/business.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import authCodeRoutes from './routes/auth_code.js';
import clientRoutes from './routes/client_routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to the database
connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the application if the database connection fails
    });

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use session middleware
app.use(sessionMiddleware);

// Routes
app.use('/api/business', businessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth-code', authCodeRoutes);
app.use('/api/clients', clientRoutes);


// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Example route to check API status
app.get('/', (req, res) => {
    res.send('Fleetwood Plumbing API is running...');
});

// Catch-all for unhandled routes (404 errors)
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack || err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
