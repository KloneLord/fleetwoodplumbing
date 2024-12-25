import express from 'express';
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    reactivateClient,
} from '../controllers/clients_controller.js';

const router = express.Router();

// Route to fetch active or archived clients
router.get('/', getClients);

// Route to fetch a single client by ID
router.get('/:id', getClientById);

// Route to create a new client
router.post('/', createClient);

// Route to update an existing client
router.put('/:id', updateClient);

// Route to reactivate an archived client
router.post('/:id/reactivate', reactivateClient);

export default router;
