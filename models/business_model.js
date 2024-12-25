const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    abn: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    authCode: { type: String, required: true },
});

const Business = mongoose.model('Business', businessSchema);