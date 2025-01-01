import express from 'express';
import {
    addInventoryItem,
    deleteItems,
    listInventoryItems,
    uploadCSV,
    validateItemAuthCode,
} from '../controllers/inventory_controller.js';
import InventoryItem from '../models/inventory_model.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Inventory Routes
router.post('/add', addInventoryItem);
router.get('/list', listInventoryItems);
router.post('/upload-csv', upload.single('csvFile'), uploadCSV);
router.post('/validate-code', validateItemAuthCode); // Validate item auth code
router.post('/delete', deleteItems);

import { generateAuthCode } from '../public/js/authCodeGenerator.js'; // Adjust path as needed

// Endpoint to generate a unique item ID for inventory
router.post('/generate-id', async (req, res) => {
    try {
        const itemId = await generateAuthCode('INV'); // Use 'INV' prefix for inventory items
        res.status(201).json({ itemId }); // Respond with the generated ID
    } catch (error) {
        console.error('Error generating item ID:', error.message);
        res.status(500).json({ error: 'Failed to generate item ID' });
    }
});


router.get('/item/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await InventoryItem.findOne({ itemId });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error.message);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});



router.post('/edit', async (req, res) => {
    try {
        const { itemId, ...updateData } = req.body;

        const updatedItem = await InventoryItem.findOneAndUpdate(
            { itemId },
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.error('Error updating item:', error.message);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// New route to toggle the hidden status
router.post('/toggle-hide', async (req, res) => {
    try {
        const { itemId } = req.body;
        const item = await InventoryItem.findOne({ itemId });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        item.hidden = !item.hidden;
        await item.save();

        res.status(200).json({ message: 'Item hidden status updated', item });
    } catch (error) {
        console.error('Error toggling hidden status:', error.message);
        res.status(500).json({ error: 'Failed to toggle hidden status' });
    }
});

router.get('/hidden-items', async (req, res) => {
    try {
        const hiddenItems = await InventoryItem.find({ hidden: true });
        res.status(200).json(hiddenItems);
    } catch (error) {
        console.error('Error fetching hidden items:', error.message);
        res.status(500).json({ error: 'Failed to fetch hidden items' });
    }
});

export default router;
