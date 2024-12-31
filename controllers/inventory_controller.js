import InventoryItem from '../models/inventory_model.js';
import AuthCode from '../models/auth_code.js';
import { generateAuthCode } from '../routes/auth_code.js';
import csvParser from 'csv-parser';
import fs from 'fs';

// Add Inventory Item with Auth Code
export const addInventoryItem = async (req, res) => {
    try {
        const { itemName, stockLevel, minStockLevel, ...otherDetails } = req.body;

        // Generate a unique auth code for the item
        const authCode = await generateAuthCode('AUTH');

        // Create the new item with the generated auth code
        const newItem = new InventoryItem({
            itemName,
            stockLevel,
            minStockLevel,
            ...otherDetails,
            authCode,
        });

        await newItem.save();

        // Save the auth code to the AuthCode collection
        const newAuthCode = new AuthCode({ code: authCode });
        await newAuthCode.save();

        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        console.error('Error adding inventory item:', error.message);
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
};

// Delete Items
export const deleteItems = async (req, res) => {
    try {
        const { ids } = req.body;
        await InventoryItem.deleteMany({ itemId: { $in: ids } });
        res.status(200).json({ message: 'Items deleted successfully' });
    } catch (error) {
        console.error('Error deleting items:', error.message);
        res.status(500).json({ error: 'Failed to delete items' });
    }
};

// Validate Auth Code for an Inventory Item
export const validateItemAuthCode = async (req, res) => {
    try {
        const { authCode } = req.body;

        // Check if the auth code exists in the AuthCode collection
        const isValid = await AuthCode.findOne({ code: authCode });

        if (isValid) {
            res.status(200).json({ valid: true, message: 'Auth code is valid' });
        } else {
            res.status(400).json({ valid: false, message: 'Invalid auth code' });
        }
    } catch (error) {
        console.error('Error validating auth code:', error.message);
        res.status(500).json({ error: 'Failed to validate auth code' });
    }
};

// List Inventory Items
export const listInventoryItems = async (req, res) => {
    try {
        const items = await InventoryItem.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error listing inventory items:', error.message);
        res.status(500).json({ error: 'Failed to list inventory items' });
    }
};

// Upload CSV
export const uploadCSV = async (req, res) => {
    const filePath = req.file?.path; // Check if file exists
    const items = [];

    if (!filePath) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        console.log('Starting CSV processing...');

        // Read and parse the CSV file
        const readStream = fs.createReadStream(filePath).pipe(csvParser());

        for await (const row of readStream) {
            console.log('Processing row:', row);

            // Validate the row for required fields
            const requiredFields = ['itemName', 'stockLevel', 'minStockLevel', 'warehouse', 'costPrice'];
            const missingFields = requiredFields.filter(field => !row[field]);

            if (missingFields.length > 0) {
                console.error(`Row missing fields: ${missingFields.join(', ')}`);
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Generate an auth code for the item
            const authCode = await generateAuthCode('AUTH');

            // Add item to the array for bulk insertion
            items.push({
                ...row,
                authCode,
                stockLevel: parseInt(row.stockLevel, 10),
                minStockLevel: parseInt(row.minStockLevel, 10),
                costPrice: parseFloat(row.costPrice),
                markupPercentage: parseFloat(row.markupPercentage || 20), // Default to 20 if not provided
                gst: parseFloat(row.gst || 10), // Default to 10% if not provided
            });
        }

        console.log('All rows processed. Saving items to database...');
        await InventoryItem.insertMany(items); // Insert items into database
        console.log('Items saved successfully.');
        res.status(200).json({ message: 'CSV uploaded successfully' });

    } catch (error) {
        console.error('Error during CSV processing:', error.message);
        res.status(500).json({ error: 'Failed to process CSV data' });
    } finally {
        // Cleanup: Delete the uploaded file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

