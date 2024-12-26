import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth_controller.js';

const router = Router();

// Login route
router.post('/login', loginUser);

// Register route
router.post('/register', registerUser);

// Get session information
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

export default router;