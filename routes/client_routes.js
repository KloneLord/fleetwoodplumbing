import express from 'express';
import {
    addClient,
    getClients,
    updateClient,
    archiveClients,
    deleteClients,
    getArchivedClients,
    reinstateClient
} from '../controllers/client_controller.js';

const router = express.Router();

// Route to add a new client
router.post('/add', addClient);

// Route to fetch all active clients
router.get('/list', getClients);

// Route to update client details by ID
router.put('/update/:id', updateClient);

// Route to archive multiple clients
router.post('/archive', archiveClients);

// Route to delete multiple clients
router.delete('/delete', deleteClients);

// Route to fetch all archived clients
router.get('/archived', getArchivedClients);

// Route to reinstate an archived client
router.post('/reinstate', reinstateClient);

export default router;
