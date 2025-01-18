import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    projectId: String,
    clientId: String,
    username: String,
    invoiceNumber: String,
    totalAmount: Number,
    sent: String,
    status: String,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;