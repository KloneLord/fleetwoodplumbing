// models/new_user_model.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const newUserSchema = new mongoose.Schema({
    user_id: { type: String, default: uuidv4, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    authCode: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    registration_link: { type: String, required: true },
    // Add any other fields you want to track
}, { timestamps: true });

const NewUserModel = mongoose.model('NewUser', newUserSchema);

export default NewUserModel;