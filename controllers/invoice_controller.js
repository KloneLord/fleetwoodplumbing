import Invoice from '../models/invoice_model.js';

export const createInvoice = async (req, res) => {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.send(invoice);
};

export const getInvoices = async (req, res) => {
    const invoices = await Invoice.find();
    res.send(invoices);
};