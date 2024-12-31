import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
    {
        itemName: { type: String, required: true, default: 'New Item' },
        itemId: { type: String, required: true, unique: true },
        barcode: { type: String, default: '0000000000000' },
        qrCode: { type: String, default: '0000000000000' },
        category: { type: String, default: 'General' },
        stockLevel: { type: Number, required: true, default: 0 },
        minStockLevel: { type: Number, required: true, default: 1 },
        warehouse: { type: String, required: true, default: 'Main Warehouse' },
        costPrice: { type: Number, required: true, default: 0.0 },
        markupPercentage: { type: Number, required: true, default: 20.0 },
        gst: { type: Number, default: 10 },
        sellingPrice: {
            type: Number,
            default: function () {
                const basePrice =
                    this.costPrice + this.costPrice * (this.markupPercentage / 100);
                return basePrice + basePrice * (this.gst / 100);
            },
        },
        supplier: { type: String, default: 'Default Supplier' },
        notes: { type: String, default: '' },
        authCode: { type: String, required: true, unique: true }, // Auth code for the item
    },
    { timestamps: true }
);

// Middleware to recalculate selling price before save
inventorySchema.pre('save', function (next) {
    const basePrice =
        this.costPrice + this.costPrice * (this.markupPercentage / 100);
    this.sellingPrice = basePrice + basePrice * (this.gst / 100);
    next();
});

const InventoryItem = mongoose.model('InventoryItem', inventorySchema);
export default InventoryItem;
