// validate_inputs.js
import { body, validationResult } from 'express-validator';

const validateInputs = [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default validateInputs;