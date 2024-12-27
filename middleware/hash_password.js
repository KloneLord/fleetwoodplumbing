import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

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

// Function to verify a password against a stored hash
export const verifyPassword = (plainPassword, storedHash) => {
    try {
        console.log('verifyPassword: Verifying password');
        // Extract the salt and hashed password from the stored hash
        const [salt, hashedPassword] = storedHash.split(':');

        // Hash the input password with the same salt
        const keyLength = 64;
        const inputHash = scryptSync(plainPassword, salt, keyLength);

        // Convert the stored hash to a Buffer
        const storedBuffer = Buffer.from(hashedPassword, 'hex');

        // Compare the hashes using a timing-safe comparison
        return timingSafeEqual(inputHash, storedBuffer);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
};