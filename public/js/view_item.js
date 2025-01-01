// js/view_item.js

// Fetch and display item details
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('itemId');

    if (!itemId) {
        document.getElementById('itemDetails').innerText = 'Item ID not provided.';
        return;
    }

    try {
        const response = await fetch(`/api/inventory/item/${itemId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch item details.');
        }

        const item = await response.json();
        displayItemDetails(item);
    } catch (error) {
        console.error('Error fetching item details:', error);
        document.getElementById('itemDetails').innerText = 'Error fetching item details.';
    }
});

// Function to display item details
function displayItemDetails(item) {
    const detailsContainer = document.getElementById('itemDetails');
    detailsContainer.innerHTML = `
        <p><strong>Item ID:</strong> ${item.itemId}</p>
        <p><strong>Item Name:</strong> ${item.itemName}</p>
        <p><strong>Barcode:</strong> ${item.barcode}</p>
        <p><strong>QR Code:</strong> ${item.qrCode}</p>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Stock Level:</strong> ${item.stockLevel}</p>
        <p><strong>Minimum Stock Level:</strong> ${item.minStockLevel}</p>
        <p><strong>Warehouse Location:</strong> ${item.warehouse}</p>
        <p><strong>Cost Price:</strong> $${item.costPrice.toFixed(2)}</p>
        <p><strong>Markup Percentage:</strong> ${item.markupPercentage}%</p>
        <p><strong>GST:</strong> ${item.gst}%</p>
        <p><strong>Selling Price:</strong> $${item.sellingPrice.toFixed(2)}</p>
    `;
}