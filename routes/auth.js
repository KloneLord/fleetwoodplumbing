import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth_controller.js';
import { hashPassword } from '../middleware/hash_password.js';

const router = Router();

// User registration endpoint (handles all roles: admin, client, worker)
router.post('/register', registerUser);

// Explicit endpoint for business admin creation
router.post('/business/create-admin', hashPassword, async (req, res, next) => {
    try {
        req.body.role = 'admin'; // Ensure the role is explicitly set to 'admin'
        req.body.access = 'full'; // Ensure access is 'full' for admins
        await registerUser(req, res, next); // Delegate to the same `registerUser` logic
    } catch (error) {
        next(error); // Handle errors gracefully
    }
});

// Login endpoint
router.post('/login', loginUser);

// Session check endpoint
router.get('/session', (req, res) => {
    console.log('session: Checking session');
    if (req.session?.user) {
        console.log('session: User authenticated', req.session.user);
        res.json({ user: req.session.user });
    } else {
        console.error('session: Not authenticated');
        res.status(401).json({ error: 'Not authenticated' });
    }
});

export default router;
