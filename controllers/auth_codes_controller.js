import AuthCode from '../models/auth_code_model.js';

// Check if a code already exists in the database
export async function checkDuplicateCode(code) {
    const codeExists = await AuthCode.findOne({ code });
    return !!codeExists; // Return true if the code exists, false otherwise
}

// Save a new code to the database
export async function saveCode(code) {
    const newCode = new AuthCode({
        code,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    });

    await newCode.save();
}

// Validate a code (ensure it exists and hasn't expired)
export async function validateCode(code) {
    const codeRecord = await AuthCode.findOne({
        code,
        expiresAt: { $gte: new Date() }, // Ensure the code hasn't expired
    });

    return !!codeRecord; // Return true if the code is valid, false otherwise
}
