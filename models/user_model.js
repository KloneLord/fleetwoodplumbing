import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    front: { type: String, required: true },
    back: { type: String }
});

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true },
    first_name: { type: String, default: 'Admin'},
    last_name: { type: String, default: 'Account'},
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    authCode: { type: String, required: true },
    created_at: { type: Date, default: Date.now },

    // Fields to be filled later
    password: { type: String, default: null },
    phone: { type: String, default: '0000000000' },
    role: { type: String, default: 'new' },
    access: { type: String, default: 'basic' },
    archived: { type: Boolean, default: false },
    created_by: { type: String, default: null },
    rate_cost: { type: Number, default: 0.00 },
    rate_charge: { type: Number, default: 0.00 },
    employment: { type: String, default: 'Casual' },
    job_title: { type: String, default: 'Worker' },
    certifications: { type: [certificationSchema], default: [] },
    profile_picture_url: { type: String, default: 'None' },
    total_hours: { type: Number, default: 0 },
    bill_hours: { type: Number, default: 0 },
    weeks_total_hours: { type: Number, default: 0 },
    weeks_bill_hours: { type: Number, default: 0 },
    tfn: { type: String, default: 'Please update' },
    claim_tax: { type: Boolean, default: true },
    notes: { type: String, default: 'None' }
}, { timestamps: true });

const User_model = mongoose.model('User', userSchema);

export default User_model;