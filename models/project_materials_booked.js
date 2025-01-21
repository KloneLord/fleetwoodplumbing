import mongoose from 'mongoose';

const bookedMaterialSchema = new mongoose.Schema({
    projectId: String,
    username: String,
    itemId: String,
    itemDescription: String,
    bookedValue: Number,
    itemValue: Number,
    time: Date,
    date: Date
});

const BookedMaterial = mongoose.models.BookedMaterial || mongoose.model('BookedMaterial', bookedMaterialSchema);
export default BookedMaterial;