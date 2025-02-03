import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sessionMiddleware from './middleware/session_middleware.js';
import businessRoutes from './routes/business_routes.js';
import adminRoutes from './routes/admin_routes.js';
import authRoutes from './routes/auth_routes.js';
import clientRoutes from './routes/client_routes.js';
import inventoryRoutes from './routes/inventory_routes.js';
import authCodeRoutes from './routes/auth_code_routes.js';
import projectSiteRoutes from './routes/project_site_routes.js';
import projectRoutes from './routes/project_routes.js';
import materialRoutes from './routes/materials_routes.js';
import plantEquipmentRoutes from './routes/plant_equipment_routes.js';
import planRoutes from './routes/plan_routes.js';
import invoiceRoutes from './routes/invoice_routes.js';
import employeeRegisterRoutes from './routes/employee_register_routes.js';
import projectTasksRoutes from './routes/project_tasks_routes.js'; // Adjust the path as necessary
import projectMaterialsRoutes from './routes/project_materials_routes.js';
import equipmentRoutes from './routes/equipment_routes.js';
import serviceRoutes from './routes/service_routes.js';
import repairRoutes from './routes/repairs_routes.js';
import timeLogRoutes from './routes/time_log_routes.js';
import scheduleRoutes from './routes/schedule_routes.js';
import businessTimesRoutes from './routes/business_times_routes.js';
import employeeColorRoutes from './routes/employee_color_routes.js';
import './models/project_materials_model.js';
import './models/project_materials_booked.js';



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
app.use('/api', projectRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth-code', authCodeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/project_sites', projectSiteRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/plantEquipment', plantEquipmentRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/employees', employeeRegisterRoutes);
app.use('/api/tasks', projectTasksRoutes);
app.use('/api/projects-materials', projectMaterialsRoutes);
app.use('/api/plant-equipment', equipmentRoutes);
app.use('/api/plant-equipment', serviceRoutes);
app.use('/api/plant-equipment', repairRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/business-times', businessTimesRoutes);
app.use('/api/employees', employeeColorRoutes);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    res.send('Fleetwood Plumbing API is running...');
});

// Example API to fetch session data
app.get('/api/fetch-session', async (req, res) => {
    try {
        const sessionResponse = await fetch('http://localhost:5000/api/auth/session');
        if (!sessionResponse.ok) {
            throw new Error(`HTTP error! status: ${sessionResponse.status}`);
        }
        const sessionData = await sessionResponse.json();
        res.status(200).json(sessionData);
    } catch (error) {
        console.error('Error fetching session data:', error.message);
        res.status(500).json({ error: error.message });
    }
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