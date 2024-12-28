import * as authController from '../controllers/auth_controller.js';
console.log(authController);

import { Router } from 'express';
import { loginUser, registerUser, createAdminUser } from '../controllers/auth_controller.js';
import { hashPassword } from '../middleware/hash_password.js';


const router = Router();

router.post('/register', hashPassword, registerUser);
router.post('/business/create-admin', hashPassword, createAdminUser);
router.post('/login', loginUser);

router.get('/session', (req, res) => {
    console.log('session: Checking session');
    if (req.session.user) {
        console.log('session: User authenticated', req.session.user);
        res.json({ user: req.session.user });
    } else {
        console.error('session: Not authenticated');
        res.status(401).json({ error: 'Not authenticated' });
    }
});

export default router;