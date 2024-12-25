import mongoose from 'mongoose';

// Define schema
const accountSchema = new mongoose.Schema({
    businessName: { type: String, required: true, unique: true },
    authKey: { type: String, required: true, unique: true },
    accountType: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
});

// Create model
const Account = mongoose.model('Account', accountSchema);

// Generate a unique 12-character key
export const generateUniqueKey = async () => {
    let unique = false;
    let key;
    while (!unique) {
        key = [...Array(12)].map(() => Math.random().toString(36).charAt(2)).join('');
        unique = await isKeyAvailable(key);
    }
    return key;
};

// Check if a key is available
export const isKeyAvailable = async (authKey) => {
    const existingAccount = await Account.findOne({ authKey });
    return !existingAccount;
};

// Check if a business name is available
export const isBusinessNameAvailable = async (businessName) => {
    const existingAccount = await Account.findOne({ businessName });
    return !existingAccount;
};

// Insert a new account
export const insertAccount = async (account) => {
    const newAccount = new Account(account);
    await newAccount.save();
};

export default Account;
