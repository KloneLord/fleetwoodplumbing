import bcrypt from 'bcryptjs';

// Middleware to hash passwords before saving to the database
const hashPassword = async (req, res, next) => {
    try {
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password' });
    }
};

export default hashPassword;