import mongoose from 'mongoose';

const SiteIdSchema = new mongoose.Schema({
    siteId: {
        type: String,
        required: true,
        unique: true
    }
});

const SiteId = mongoose.model('SiteId', SiteIdSchema);
export default SiteId;