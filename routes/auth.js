import { Router } from 'express';
import { loginUser, registerUser, createAdminUser } from '../controllers/auth_controller.js';
import hashPassword from '../middleware/hash_password.js';

const router = Router();

// Register route
router.post('/register', hashPassword, registerUser);

// Create admin user route
router.post('/business/create-admin', hashPassword, createAdminUser);

// Login route
router.post('/login', loginUser);

// Get session information
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

export default router;