// Function to show the selected tab
// Function to show the selected tab
function showTab(tabId) {
    // Hide all tabs and remove 'active' class
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    // Show the selected tab and add 'active' class
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
        activeTab.classList.add('active');
    }

    // Remove 'active' class from all tab buttons
    const buttons = document.querySelectorAll('.tab-buttons button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the clicked tab button
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Refresh scripts based on the tab being displayed
    if (tabId === 'misc_tab') {
        fetchHiddenClients();
    }
    // Add other tab-specific script refreshes as needed
}

// Function to generate an auth code
async function generateAuthCode(requestSource = 'client') {
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
    document.getElementById('addClientId').value = await generateAuthCode();
    await fetchClientList();
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeForms);

// Add Client Form Submission
document.getElementById('addClientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!clientData.clientId || !clientData.fullName) {
        alert('Client ID and Full Name are required.');
        return;
    }

    try {
        const response = await fetch('/api/clients/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            throw new Error('Failed to save client.');
        }

        alert('Client saved successfully!');
        e.target.reset();
        document.getElementById('addClientId').value = await generateAuthCode();
        await fetchClientList();
    } catch (error) {
        console.error('Error saving client:', error);
    }
});

document.getElementById('editClientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!clientData.clientId || !clientData.fullName) {
        alert('Client ID and Full Name are required.');
        return;
    }

    try {
        const response = await fetch(`/api/clients/update/${clientData.clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update client: ${errorText}`);
        }

        alert('Client updated successfully!');
        await fetchClientList(); // Refresh client list
        showTab('client_list_tab'); // Go back to the list tab
    } catch (error) {
        console.error('Error updating client:', error);
        alert(`Error updating client: ${error.message}`);
    }
});
async function fetchClientList() {
    try {
        const response = await fetch('/api/clients/list');
        if (!response.ok) throw new Error('Failed to fetch clients.');

        const clients = await response.json();
        const tbody = document.querySelector('#clientTable tbody');
        tbody.innerHTML = '';

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No clients found.</td></tr>';
            return;
        }

        clients.forEach((client) => {
            if (client.accountStatus !== 'hidden') {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="width: 5%;"><input type="checkbox" name="selectClient" value="${client.clientId}"></td>
                    <td style="width: 15%;">${client.clientId}</td>
                    <td style="width: 25%;">${client.fullName}</td>
                    <td style="width: 20%;">${client.email}</td>
                    <td style="width: 20%;">${client.phone}</td>
                    <td style="width: 15%;">
                        <button class="slim-styled-button" onclick="editClient('${client.clientId}')">Edit</button>
                        <button class="slim-styled-button" onclick="toggleHide('${client.clientId}')">Hide</button>
                        <button class="slim-styled-button" onclick="viewClient('${client.clientId}')">View</button>
                    </td>
                `;
                tbody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Error fetching client list:', error);
    }
}


// Initialize form and fetch clients when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await fetchClientList();
});



// Function to filter the client list
function filterClientList() {
    const searchValue = document.getElementById('clientSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#clientTable tbody tr');

    rows.forEach(row => {
        const clientName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        if (clientName.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to select all rows
function selectAllRows(checkbox) {
    const checkboxes = document.querySelectorAll('#clientTable tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Function to delete selected clients
async function deleteSelectedClients() {
    const selectedIds = Array.from(document.querySelectorAll('#clientTable tbody input[type="checkbox"]:checked'))
        .map(cb => cb.closest('tr').querySelector('td:nth-child(2)').textContent);

    try {
        const response = await fetch('/api/clients/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (!response.ok) throw new Error('Failed to delete clients');

        await fetchClientList();
    } catch (error) {
        console.error('Error deleting clients:', error);
    }
}


async function editClient(clientId) {
    showTab('edit_client_tab'); // Switch to the edit tab

    try {
        console.log('Fetching details for clientId:', clientId);

        // Fetch client details from the backend
        const response = await fetch(`/api/clients/client/${clientId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Client not found. Please verify the client ID.');
            }
            throw new Error('Failed to fetch client details.');
        }

        const client = await response.json();

        // Populate the edit form fields
        document.getElementById('editClientId').value = client.clientId || '';
        document.getElementById('editFullName').value = client.fullName || '';
        document.getElementById('editBusinessName').value = client.businessName || '';
        document.getElementById('editUsername').value = client.username || '';
        document.getElementById('editPassword').value = ''; // Password should not be pre-filled for security reasons
        document.getElementById('editEmail').value = client.email || '';
        document.getElementById('editPhone').value = client.phone || '';
        document.getElementById('editStreetAddress').value = client.streetAddress || '';
        document.getElementById('editCity').value = client.city || '';
        document.getElementById('editState').value = client.state || '';
        document.getElementById('editPostalCode').value = client.postalCode || '';
        document.getElementById('editCountry').value = client.country || '';
        document.getElementById('editPostalStreetAddress').value = client.postalStreetAddress || '';
        document.getElementById('editPostalCity').value = client.postalCity || '';
        document.getElementById('editPostalState').value = client.postalState || '';
        document.getElementById('editPostalPostalCode').value = client.postalPostalCode || '';
        document.getElementById('editPostalCountry').value = client.postalCountry || '';
        document.getElementById('editPOBoxAddress').value = client.poBoxAddress || '';

    } catch (error) {
        console.error('Error fetching client details:', error);
        alert(error.message);
    }
}

async function toggleHide(clientId) {
    try {
        const response = await fetch('/api/clients/toggle-hide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId }),

        });
        fetchHiddenClients();
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to toggle hide status: ${errorText}`);
        }

        const result = await response.json();
        alert(result.message);
        await fetchClientList(); // Refresh the client list after updating the hidden status
    } catch (error) {
        console.error('Error toggling hide status:', error);
        alert(`Error toggling hide status: ${error.message}`);
    }
}

function viewClient(clientId) {
    const width = Math.round(window.innerWidth * 0.9);
    const height = Math.round(window.innerHeight * 0.9);
    const left = Math.round((window.innerWidth - width) / 2);
    const top = Math.round((window.innerHeight - height) / 2);
    const params = `width=${width},height=${height},left=${left},top=${top},status=no,scrollbars=yes,resizable=yes`;
    window.open(`portal_client_view.html?clientId=${clientId}`, '_blank', params);
}


// Function to fetch and display hidden clients
async function fetchHiddenClients() {
    try {
        const response = await fetch('/api/clients/archived');
        if (!response.ok) throw new Error('Failed to fetch hidden clients.');

        const clients = await response.json();
        const tbody = document.querySelector('#hiddenClientTable tbody');
        tbody.innerHTML = '';

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No hidden clients found.</td></tr>';
            return;
        }

        clients.forEach((client) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="width: 15%;">${client.clientId}</td>
                <td style="width: 25%;">${client.fullName}</td>
                <td style="width: 20%;">${client.email}</td>
                <td style="width: 20%;">${client.phone}</td>
                <td style="width: 20%;">
                    <button class="slim-styled-button" onclick="toggleHide('${client.clientId}')">Unhide</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching hidden clients:', error);
    }
}

// Call fetchHiddenClients when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchHiddenClients);

// Function to un-hide a client
async function unhideClient(clientId) {
    try {
        const response = await fetch('/api/clients/toggle-hide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to un-hide client: ${errorText}`);
        }

        alert('Client un-hidden successfully');
        await fetchHiddenClients(); // Refresh the hidden clients list
        await fetchClientList(); // Refresh the client list
    } catch (error) {
        console.error('Error un-hiding client:', error);
        alert(`Error un-hiding client: ${error.message}`);
    }
}

// CSV Upload Form Event Listener
document.getElementById('uploadCsvForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('csvFile');
    formData.append('csvFile', fileInput.files[0]);

    try {
        const response = await fetch('/api/clients/upload-csv', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload CSV file: ${errorText}`);
        }

        const result = await response.json();
        alert(result.message);
        await fetchClientList();
    } catch (error) {
        console.error('Error uploading CSV file:', error);
        alert(`Error uploading CSV file: ${error.message}`);
    }
});

// Function to log out
async function logOut() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to log out');

        alert('You have been logged out successfully!');
        window.location.href = 'portal_login.html'; // Redirect to login page
    } catch (error) {
        console.error('Error during logout:', error.message);
        alert('An error occurred while logging out. Please try again.');
    }
}

// Fetch session information and initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (sessionData.user) {
            document.getElementById('username').innerText = sessionData.user.username;
            document.getElementById('role').innerText = sessionData.user.role;
            document.getElementById('access').innerText = sessionData.user.access;
        } else {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'portal_registration.html';
        }
    } catch (error) {
        console.error('Error fetching session information:', error);
        alert('An error occurred. Please try again.');
    }
});

function copyPhysicalToPostal() {
    const streetAddress = document.getElementById('editStreetAddress').value;
    const city = document.getElementById('editCity').value;
    const state = document.getElementById('editState').value;
    const postalCode = document.getElementById('editPostalCode').value;
    const country = document.getElementById('editCountry').value;

    document.getElementById('editPostalStreetAddress').value = streetAddress;
    document.getElementById('editPostalCity').value = city;
    document.getElementById('editPostalState').value = state;
    document.getElementById('editPostalPostalCode').value = postalCode;
    document.getElementById('editPostalCountry').value = country;
}

// Ensure this function is called when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('copy-address-button').addEventListener('click', copyPhysicalToPostal);
});
