// Functions for handling tabs
export function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.style.display = tab.id === tabId ? 'block' : 'none');

    const tabButtons = document.querySelectorAll('.tab-buttons button');
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-tab') === tabId);
    });
}

export function showSubTab(subTabId) {
    const subTabs = document.querySelectorAll('.sub-tabs');
    subTabs.forEach(subTab => subTab.classList.remove('active'));

    const selectedSubTab = document.getElementById(subTabId);
    if (selectedSubTab) {
        selectedSubTab.classList.add('active');
    }
}

// Function to log out
export async function logOut() {
    try {
        const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        if (!response.ok) throw new Error('Failed to log out');
        alert('You have been logged out successfully!');
        window.location.href = 'portal_login.html';
    } catch (error) {
        console.error('Error during logout:', error.message);
        alert('An error occurred while logging out. Please try again.');
    }
}

// Function to fetch project site details and update the project tab
async function fetchProjectSiteDetails(clientId, projectSite) {
    try {
        const response = await fetch(`/api/projects-sites/details?clientId=${clientId}&projectSite=${projectSite}`);
        if (!response.ok) throw new Error('Failed to fetch project site details.');

        const siteDetails = await response.json();

        return siteDetails;
    } catch (error) {
        console.error('Error fetching project site details:', error);
        alert('Failed to fetch project site details. Please try again.');
        return null;
    }
}

// Function to fetch project site details and update the project tab
async function fetchProjectSiteDetails(clientId, projectSite) {
    try {
        const response = await fetch(`/api/projects-sites/details?clientId=${clientId}&projectSite=${projectSite}`);
        if (!response.ok) throw new Error('Failed to fetch project site details.');

        const siteDetails = await response.json();
        console.log('Project Site Details:', siteDetails); // Log the details for troubleshooting
        return siteDetails;
    } catch (error) {
        console.error('Error fetching project site details:', error);
        alert('Failed to fetch project site details. Please try again.');
        return null;
    }
}

// Function to fetch project details and update the project tab
async function fetchProjectDetails(projectID) {
    try {
        const response = await fetch(`/api/projects/${projectID}`);
        if (!response.ok) throw new Error('Failed to fetch project details.');

        const project = await response.json();
        const projectTabContent = document.getElementById('project_tab_content');

        // Fetch project site details
        const siteDetails = await fetchProjectSiteDetails(project.clientId, project.projectSite);

        // Populate project details
        projectTabContent.innerHTML = `
      <p><strong>Project:</strong> ${project.title}</p>
      <p><strong>Client:</strong> ${project.customer}</p>
      <p><strong>Project Site:</strong> ${project.projectSite}</p>
      ${siteDetails ? `
        <p><strong>Street address:</strong> ${siteDetails.project_site_street}</p>
        <p><strong>Town/City:</strong> ${siteDetails.project_site_city}</p>
        <p><strong>Post Code:</strong> ${siteDetails.project_site_postcode}</p>
        <p><strong>State:</strong> ${siteDetails.project_site_state}</p>
        <p><strong>Country:</strong> ${siteDetails.project_site_country}</p>
      ` : ''}
      <p><strong>Description:</strong> ${project.description}</p>
      <p><strong>Status:</strong> ${project.status}</p>
      <hr>
      <p><strong>Project ID:</strong> ${project.projectID}</p>
      <p><strong>Client ID:</strong> ${project.clientId}</p>
    `;
    } catch (error) {
        console.error('Error fetching project details:', error);
        alert('Failed to fetch project details. Please try again.');
    }
}


// Function to fetch materials booked
export async function fetchMaterialsBooked(projectID) {
    try {
        const response = await fetch(`/api/projects-materials/booked/${projectID}`);
        if (!response.ok) throw new Error('Failed to fetch materials booked.');

        const materialsBooked = await response.json();
        const materialsBookedTableBody = document.getElementById('materials_booked_table_body');

        materialsBookedTableBody.innerHTML = '';

        const aggregatedMaterials = materialsBooked.reduce((acc, entry) => {
            if (!acc[entry.item_id]) {
                acc[entry.item_id] = { ...entry, total_quantity: 0 };
            }
            acc[entry.item_id].total_quantity += entry.quantity_booked_out;
            return acc;
        }, {});

        Object.values(aggregatedMaterials).forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${entry.item_id}</td>
        <td>${entry.item_name}</td>
        <td>${entry.item_category}</td>
        <td>${entry.total_quantity}</td>
      `;
            materialsBookedTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching materials booked:', error);
        alert('Failed to fetch materials booked. Please try again.');
    }
}

// Function to fetch materials log
export async function fetchMaterialsLog(projectID) {
    try {
        const response = await fetch(`/api/projects-materials/log/${projectID}`);
        if (!response.ok) throw new Error('Failed to fetch materials log.');

        const materialsLog = await response.json();
        const materialsLogTableBody = document.getElementById('materials_log_table_body');

        materialsLogTableBody.innerHTML = '';

        materialsLog.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.time}</td>
        <td>${entry.item_id}</td>
        <td>${entry.item_name}</td>
        <td>${entry.item_category}</td>
        <td>${entry.quantity_booked_out}</td>
        <td>${entry.username}</td>
      `;
            materialsLogTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching materials log:', error);
        alert('Failed to fetch materials log. Please try again.');
    }
}

// Function to load employees into dropdown
export async function loadEmployees() {
    try {
        const response = await fetch('/api/employees/all');
        const employees = await response.json();

        const assignedInput = document.getElementById('assigned_input');
        assignedInput.innerHTML = '';

        const unassignedOption = document.createElement('option');
        unassignedOption.value = '';
        unassignedOption.text = 'Unassigned';
        assignedInput.appendChild(unassignedOption);

        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.user_id;
            option.text = `${employee.first_name} ${employee.last_name}`;
            assignedInput.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading employees:', error);
        alert('An error occurred while loading employees. Please try again.');
    }
}

// Function to load category buttons and filter inventory
export async function loadCategoryButtons() {
    try {
        const response = await fetch('/api/inventory/list');
        const inventoryItems = await response.json();

        const categories = Array.from(new Set(inventoryItems.map(item => item.category)));
        const categoryButtonsContainer = document.getElementById('category_buttons');
        categoryButtonsContainer.innerHTML = '';

        categories.forEach(category => {
            const button = document.createElement('button');
            button.innerText = category;
            button.classList.add('styled-button');
            button.onclick = () => toggleCategoryFilter(button);
            categoryButtonsContainer.appendChild(button);
        });

        loadInventoryItems(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('An error occurred while loading categories. Please try again.');
    }
}

// Function to load return category buttons and filter inventory
export async function loadReturnCategoryButtons() {
    try {
        const response = await fetch('/api/inventory/list');
        const inventoryItems = await response.json();

        const categories = Array.from(new Set(inventoryItems.map(item => item.category)));
        const returnCategoryButtonsContainer = document.getElementById('return_category_buttons');
        returnCategoryButtonsContainer.innerHTML = '';

        categories.forEach(category => {
            const button = document.createElement('button');
            button.innerText = category;
            button.classList.add('styled-button');
            button.onclick = () => toggleReturnCategoryFilter(button);
            returnCategoryButtonsContainer.appendChild(button);
        });

        loadReturnInventoryItems(categories);
    } catch (error) {
        console.error('Error loading return categories:', error);
        alert('An error occurred while loading return categories. Please try again.');
    }
}

// Function to toggle category filter for materials
function toggleCategoryFilter(button, tableBodyId = 'inventory_table_body') {
    button.classList.toggle('active');
    button.style.backgroundColor = button.classList.contains('active') ? 'lightgreen' : '';

    const activeCategories = Array.from(document.querySelectorAll('.styled-button.active'))
        .map(btn => btn.innerText);

    loadInventoryItems(activeCategories, tableBodyId);
}

// Function to toggle return category filter for materials
function toggleReturnCategoryFilter(button, tableBodyId = 'return_inventory_table_body') {
    button.classList.toggle('active');
    button.style.backgroundColor = button.classList.contains('active') ? 'lightgreen' : '';

    const activeCategories = Array.from(document.querySelectorAll('.styled-button.active'))
        .map(btn => btn.innerText);

    loadReturnInventoryItems(activeCategories, tableBodyId);
}

// Function to book out materials
export async function bookOutMaterials() {
    try {
        const rows = document.querySelectorAll('#inventory_table_body tr');
        const materialsToBookOut = [];

        rows.forEach(row => {
            const itemId = row.children[0].innerText;
            const description = row.children[1].innerText;
            const category = row.children[2].innerText;
            const quantityTaken = parseInt(row.querySelector('label').innerText);

            if (quantityTaken > 0) {
                materialsToBookOut.push({
                    itemId,
                    description,
                    category,
                    quantity: quantityTaken,
                });
            }
        });

        if (materialsToBookOut.length === 0) {
            alert('No materials selected for booking out.');
            return;
        }

        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (!sessionData.user) {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'portal_login.html';
            return;
        }

        const project_id = getProjectId();
        const username = sessionData.user.username;

        const response = await fetch('/api/projects-materials/book-out', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id, username, materials: materialsToBookOut }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to book out materials.');
        }

        alert('Materials successfully booked out.');
        loadInventoryItems();
    } catch (error) {
        console.error('Error booking out materials:', error.message);
        alert('Failed to book out materials. Please try again.');
    }
}

// Function to return materials
export async function returnMaterials() {
    try {
        const rows = document.querySelectorAll('#return_inventory_table_body tr');
        const materialsToReturn = [];

        rows.forEach(row => {
            const itemId = row.children[0].innerText;
            const description = row.children[1].innerText;
            const category = row.children[2].innerText;
            const quantityTaken = parseInt(row.querySelector('label').innerText);

            if (quantityTaken > 0) {
                materialsToReturn.push({
                    itemId,
                    description,
                    category,
                    quantity: quantityTaken,
                });
            }
        });

        if (materialsToReturn.length === 0) {
            alert('No materials selected for return.');
            return;
        }

        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (!sessionData.user) {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'portal_login.html';
            return;
        }

        const project_id = getProjectId();
        const username = sessionData.user.username;

        const response = await fetch('/api/projects-materials/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id, username, materials: materialsToReturn }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to return materials.');
        }

        alert('Materials successfully returned.');
        loadReturnInventoryItems();
    } catch (error) {
        console.error('Error returning materials:', error.message);
        alert('Failed to return materials. Please try again.');
    }
}

// Function to clear return materials
export function clearReturn() {
    const rows = document.querySelectorAll('#return_inventory_table_body tr');
    rows.forEach(row => {
        const quantityLabel = row.querySelector('label');
        if (quantityLabel) quantityLabel.innerText = '0';
    });
}

// Function to load return inventory items
export async function loadReturnInventoryItems(activeCategories = [], tableBodyId = 'return_inventory_table_body') {
    try {
        const response = await fetch('/api/inventory/list');
        const inventoryItems = await response.json();

        const filteredItems = inventoryItems.filter(item =>
            !item.hidden && (activeCategories.length === 0 || activeCategories.includes(item.category))
        );

        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = '';

        filteredItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${item.itemId}</td>
        <td>${item.itemName}</td>
        <td>${item.category}</td>
        <td>${item.stockLevel}</td>
        <td><label id="quantity_taken_return_${item.itemId}">0</label></td>
        <td>
          <button onclick="adjustReturnQuantity('${item.itemId}', 1)">+1</button>
          <button onclick="adjustReturnQuantity('${item.itemId}', 5)">+5</button>
          <button onclick="adjustReturnQuantity('${item.itemId}', 25)">+25</button>
          <button onclick="adjustReturnQuantity('${item.itemId}', 0, true)">Reset</button>
        </td>
      `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading return inventory items:', error.message);
    }
}

// Function to adjust return quantity
export function adjustReturnQuantity(itemId, amount, reset = false) {
    const quantityLabel = document.getElementById(`quantity_taken_return_${itemId}`);
    if (reset) {
        quantityLabel.innerText = '0';
    } else {
        const currentValue = parseInt(quantityLabel.innerText) || 0;
        quantityLabel.innerText = currentValue + amount;
    }
}

// Function to clear book out materials
export function clearBookOut() {
    const rows = document.querySelectorAll('#inventory_table_body tr');
    rows.forEach(row => {
        const quantityLabel = row.querySelector('label');
        if (quantityLabel) quantityLabel.innerText = '0';
    });
}

// Function to load inventory items
export async function loadInventoryItems(activeCategories = [], tableBodyId = 'inventory_table_body') {
    try {
        const response = await fetch('/api/inventory/list');
        const inventoryItems = await response.json();

        const filteredItems = inventoryItems.filter(item =>
            !item.hidden && (activeCategories.length === 0 || activeCategories.includes(item.category))
        );

        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = '';

        filteredItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${item.itemId}</td>
        <td>${item.itemName}</td>
        <td>${item.category}</td>
        <td>${item.stockLevel}</td>
        <td><label id="quantity_taken_${item.itemId}">0</label></td>
        <td>
          <button onclick="adjustQuantity('${item.itemId}', 1)">+1</button>
          <button onclick="adjustQuantity('${item.itemId}', 5)">+5</button>
          <button onclick="adjustQuantity('${item.itemId}', 25)">+25</button>
          <button onclick="adjustQuantity('${item.itemId}', 0, true)">Reset</button>
        </td>
      `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading inventory items:', error.message);
    }
}

// Function to adjust quantity
export function adjustQuantity(itemId, amount, reset = false) {
    const quantityLabel = document.getElementById(`quantity_taken_${itemId}`);
    if (reset) {
        quantityLabel.innerText = '0';
    } else {
        const currentValue = parseInt(quantityLabel.innerText) || 0;
        quantityLabel.innerText = currentValue + amount;
    }
}

// Function to get project ID from URL
export function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('projectID');
}

// Main initialization for the dashboard
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (!sessionData.user) {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'portal_login.html';
        } else {
            document.getElementById('username').innerText = sessionData.user.username;
            document.getElementById('role').innerText = sessionData.user.role;
            document.getElementById('access').innerText = sessionData.user.access;
            await loadEmployees();
            await loadCategoryButtons();
            await loadReturnCategoryButtons();
        }

        const projectID = getProjectId();
        document.getElementById('project_id_footer').innerText = `Project - ${projectID}`;
        await fetchProjectDetails(projectID);
        await fetchMaterialsLog(projectID);
        await fetchMaterialsBooked(projectID);

        const now = new Date().toISOString().split('T')[0];
        document.getElementById('task_hours_input').value = 1;
        document.getElementById('start_time_input').value = `${now}T08:00`;
        document.getElementById('end_time_input').value = `${now}T16:30`;

        document.getElementById('bookOutMaterialsBtn').addEventListener('click', async () => {
            await bookOutMaterials();
            await fetchMaterialsBooked(projectID);
            await fetchMaterialsLog(projectID);
        });

        document.getElementById('returnMaterialsBtn').addEventListener('click', async () => {
            await returnMaterials();
            await fetchMaterialsBooked(projectID);
            await fetchMaterialsLog(projectID);
        });

    } catch (error) {
        console.error('Error initializing page:', error);
        alert('An error occurred. Please try again.');
    }
});

window.showTab = showTab;
window.showSubTab = showSubTab;
window.logOut = logOut;