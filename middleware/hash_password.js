import { randomBytes, scryptSync } from 'crypto';

// Function to hash a password using Scrypt and a salt
export const hashPassword = (plainPassword) => {
    try {
        console.log('hashPassword: Hashing password');
        // Generate a random salt
        const salt = randomBytes(16).toString('hex');

        // Hash the password with Scrypt
        const keyLength = 64; // Length of the derived key
        const hashedPassword = scryptSync(plainPassword, salt, keyLength).toString('hex');

        // Combine the salt and hashed password for storage
        return `${salt}:${hashedPassword}`;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

// Middleware to hash the password in the request body
export const hashPasswordMiddleware = (req, res, next) => {
    try {
        if (req.body && req.body.password) {
            req.body.password = hashPassword(req.body.password);
            next();
        } else {
            console.error('Password is required');
        }
    } catch (error) {
        console.error('Error in hashPasswordMiddleware:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};