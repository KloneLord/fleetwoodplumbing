// Function to show the selected tab
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
        activeTab.classList.add('active');
    }

    const buttons = document.querySelectorAll('.tab-buttons button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Function to generate an auth code
async function generateAuthCode(requestSource = 'inventory') {
    try {
        const response = await fetch('/api/auth-code/generate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: requestSource }),
        });

        if (!response.ok) throw new Error('Failed to generate auth code.');

        const { authCode } = await response.json();
        return authCode;
    } catch (error) {
        console.error('Error generating auth code:', error);
        throw error;
    }
}

// Initialize Forms
async function initializeForms() {
    document.getElementById('addItemId').value = await generateAuthCode();
    await fetchInventoryList();
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeForms);

// Add Item Form: Selling Price Calculation
const addCostPriceInput = document.getElementById('addCostPrice');
const addMarkupInput = document.getElementById('addMarkup');
const addGstInput = document.getElementById('addGst');
const addSellingPriceInput = document.getElementById('addSellingPrice');

function updateAddSellingPrice() {
    const costPrice = parseFloat(addCostPriceInput.value) || 0;
    const markup = parseFloat(addMarkupInput.value) || 0;
    const gst = parseFloat(addGstInput.value) || 0;

    const baseSellingPrice = costPrice + (costPrice * (markup / 100));
    const sellingPrice = baseSellingPrice + (baseSellingPrice * (gst / 100));

    addSellingPriceInput.value = sellingPrice.toFixed(2);
}

addCostPriceInput.addEventListener('input', updateAddSellingPrice);
addMarkupInput.addEventListener('input', updateAddSellingPrice);
addGstInput.addEventListener('input', updateAddSellingPrice);

// Edit Item Form: Selling Price Calculation
const editCostPriceInput = document.getElementById('editCostPrice');
const editMarkupInput = document.getElementById('editMarkup');
const editGstInput = document.getElementById('editGst');
const editSellingPriceInput = document.getElementById('editSellingPrice');

function updateEditSellingPrice() {
    const costPrice = parseFloat(editCostPriceInput.value) || 0;
    const markup = parseFloat(editMarkupInput.value) || 0;
    const gst = parseFloat(editGstInput.value) || 0;

    const baseSellingPrice = costPrice + (costPrice * (markup / 100));
    const sellingPrice = baseSellingPrice + (baseSellingPrice * (gst / 100));

    editSellingPriceInput.value = sellingPrice.toFixed(2);
}

editCostPriceInput.addEventListener('input', updateEditSellingPrice);
editMarkupInput.addEventListener('input', updateEditSellingPrice);
editGstInput.addEventListener('input', updateEditSellingPrice);

// Add Item Form Submission
document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/inventory/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            throw new Error('Failed to save item.');
        }

        alert('Item saved successfully!');
        e.target.reset();
        document.getElementById('addItemId').value = await generateAuthCode();
    } catch (error) {
        console.error('Error saving item:', error);
    }
});

// Edit Item Form Submission
document.getElementById('editItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/inventory/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update item: ${errorText}`);
        }

        alert('Item updated successfully!');
        await fetchInventoryList(); // Refresh inventory list
        showTab('inventory_list_tab'); // Go back to the list tab
    } catch (error) {
        console.error('Error updating item:', error);
        alert(`Error updating item: ${error.message}`);
    }
});

// Function to fetch the inventory list
async function fetchInventoryList() {
    try {
        const response = await fetch('/api/inventory/list');
        if (!response.ok) throw new Error('Failed to fetch inventory.');

        const items = await response.json();
        const tbody = document.querySelector('#inventoryTable tbody');
        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No items found.</td></tr>';
            return;
        }

        items.forEach((item) => {
            if (!item.hidden) { // Only display items that are not hidden
                const row = document.createElement('tr');
                row.dataset.item = JSON.stringify(item); // Store the full item data as JSON
                row.innerHTML = `
                    <td><input type="checkbox" name="selectItem" value="${item.itemId}"></td>
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td>${item.stockLevel}</td>
                    <td>${item.minStockLevel}</td>
                    <td>${item.warehouse}</td>
                    <td>
                        <button class="slim-styled-button" onclick="editItem('${item.itemId}')">Edit</button>
                        <button class="slim-styled-button" onclick="toggleHide('${item.itemId}')">Hide</button>
                        <button class="slim-styled-button" onclick="viewItem('${item.itemId}')">View</button>
                    </td>
                `;
                tbody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error fetching inventory list:', error);
    }
}

// Function to view an item
function viewItem(itemId) {
    const width = Math.round(window.innerWidth * 0.9);
    const height = Math.round(window.innerHeight * 0.9);
    const left = Math.round((window.innerWidth - width) / 2);
    const top = Math.round((window.innerHeight - height) / 2);
    const params = `width=${width},height=${height},left=${left},top=${top},status=no,scrollbars=yes,resizable=yes`;
    window.open(`portal_inventory_view.html?itemId=${itemId}`, '_blank', params);
}

// Function to toggle the hidden status of an item
async function toggleHide(itemId) {
    try {
        const response = await fetch('/api/inventory/toggle-hide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to toggle hide status: ${errorText}`);
        }

        const result = await response.json();
        alert(result.message);
        await fetchInventoryList(); // Refresh the inventory list after updating the hidden status
    } catch (error) {
        console.error('Error toggling hide status:', error);
        alert(`Error toggling hide status: ${error.message}`);
    }
}

// Function to edit an item
async function editItem(itemId) {
    showTab('edit_item_tab'); // Switch to the edit tab

    try {
        console.log('Fetching details for itemId:', itemId);

        // Fetch item details from the backend
        const response = await fetch(`/api/inventory/item/${itemId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Item not found. Please verify the item ID.');
            }
            throw new Error('Failed to fetch item details.');
        }

        const item = await response.json();

        // Populate the edit form fields
        document.getElementById('editItemId').value = item.itemId || '';
        document.getElementById('editItemName').value = item.itemName || '';
        document.getElementById('editBarcode').value = item.barcode || '';
        document.getElementById('editQrCode').value = item.qrCode || '';
        document.getElementById('editCategory').value = item.category || '';
        document.getElementById('editStockLevel').value = item.stockLevel || 0;
        document.getElementById('editMinStockLevel').value = item.minStockLevel || 0;
        document.getElementById('editWarehouse').value = item.warehouse || '';
        document.getElementById('editCostPrice').value = item.costPrice || 0.0;
        document.getElementById('editMarkup').value = item.markupPercentage || 0.0;
        document.getElementById('editGst').value = item.gst || 0.0;
        document.getElementById('editSellingPrice').value = item.sellingPrice || 0.0;

    } catch (error) {
        console.error('Error fetching item details:', error);
        alert(error.message);
    }
}

// Function to filter the inventory list by item ID and description
function filterInventoryList() {
    const searchValue = document.getElementById('inventorySearch').value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryTable tbody tr');

    rows.forEach(row => {
        const itemId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const itemName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

        if (itemId.includes(searchValue) || itemName.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to select all rows
function selectAllRows(checkbox) {
    const checkboxes = document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Function to delete selected items
async function deleteSelectedItems() {
    const selectedIds = Array.from(document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    if (selectedIds.length === 0) {
        alert('No items selected.');
        return;
    }

    if (!confirm('Are you sure you want to delete the selected items?')) {
        return;
    }

    try {
        const response = await fetch('/api/inventory/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (!response.ok) throw new Error('Failed to delete items');

        await fetchInventoryList();
    } catch (error) {
        console.error('Error deleting items:', error);
    }
}

// Function to hide selected items
async function hideSelectedItems() {
    const selectedIds = Array.from(document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    if (selectedIds.length === 0) {
        alert('No items selected.');
        return;
    }

    try {
        const response = await fetch('/api/inventory/toggle-hide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemIds: selectedIds })
        });

        if (!response.ok) throw new Error('Failed to hide items');

        await fetchInventoryList();
    } catch (error) {
        console.error('Error hiding items:', error);
    }
}

// Attach event listeners to delete and hide buttons
document.getElementById('deleteSelected').addEventListener('click', deleteSelectedItems);
document.getElementById('hideSelected').addEventListener('click', hideSelectedItems);

// Function to fetch and display hidden items
async function fetchHiddenItems() {
    try {
        const response = await fetch('/api/inventory/hidden-items');
        if (!response.ok) throw new Error('Failed to fetch hidden items.');

        const items = await response.json();
        const tbody = document.querySelector('#hiddenItemsTable tbody');
        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No hidden items found.</td></tr>';
            return;
        }

        items.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.itemId}</td>
                <td>${item.itemName}</td>
                <td><button class="slim-styled-button" onclick="unhideItem('${item.itemId}')">Re-activate Item</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching hidden items:', error);
    }
}

// Function to un-hide an item
async function unhideItem(itemId) {
    try {
        const response = await fetch('/api/inventory/toggle-hide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to un-hide item: ${errorText}`);
        }

        alert('Item un-hidden successfully');
        await fetchHiddenItems(); // Refresh the hidden items list
        await fetchInventoryList(); // Refresh the inventory list
    } catch (error) {
        console.error('Error un-hiding item:', error);
        alert(`Error un-hiding item: ${error.message}`);
    }
}

// Call fetchHiddenItems when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchHiddenItems();
    } catch (error) {
        console.error('Error initializing hidden items:', error);
    }
});

// CSV Upload Form Event Listener
document.getElementById('uploadCsvForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('csvFile');
    formData.append('csvFile', fileInput.files[0]);

    try {
        const response = await fetch('/api/inventory/upload-csv', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload CSV file: ${errorText}`);
        }

        const result = await response.json();
        alert(result.message);
        await fetchInventoryList();
    } catch (error) {
        console.error('Error uploading CSV file:', error);
        alert(`Error uploading CSV file: ${error.message}`);
    }
});