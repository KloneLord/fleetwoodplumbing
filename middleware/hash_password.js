// middleware/hash_password.js
import bcrypt from 'bcrypt';

export async function hashPassword(req, res, next) {
    if (!req.body.password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        console.log('Password hashed successfully.');
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
