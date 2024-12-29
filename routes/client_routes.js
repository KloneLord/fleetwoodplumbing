// routes/client_routes.js

import express from 'express';
import { addClient, getClients, updateClient, archiveClients, deleteClients, getArchivedClients, reinstateClient } from '../controllers/client_controller.js';

const router = express.Router();

router.post('/add', addClient);
router.get('/list', getClients);
router.put('/update/:id', updateClient);
router.post('/archive', archiveClients);
router.delete('/delete', deleteClients);
router.get('/archived', getArchivedClients);
router.post('/reinstate', reinstateClient);

export default router;