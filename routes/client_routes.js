import express from 'express';
import multer from 'multer';
import {
    addClient,
    getClients,
    updateClient,
    toggleHideClient,
    getClientById,
    deleteClients,
    getArchivedClients,
    reinstateClient,
    uploadCsv
} from '../controllers/client_controller.js';

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to add a new client
router.post('/add', addClient);

// Route to fetch all active clients
router.get('/list', getClients);

// Route to update client details by clientId
router.put('/update/:id', updateClient);

// Route to toggle the hidden status of a client
router.post('/toggle-hide', toggleHideClient);

// Route to fetch a client by clientId
router.get('/client/:id', getClientById);

// Route to delete multiple clients
router.post('/delete', deleteClients);

// Route to fetch all archived clients
router.get('/archived', getArchivedClients);

// Route to reinstate an archived client
router.post('/reinstate', reinstateClient);

// Route to upload a CSV file
router.post('/upload-csv', upload.single('csvFile'), uploadCsv);

export default router;