async function fetchClientList() {
    console.log('Fetching client list...');
    try {
        const response = await fetch('/api/clients/list');
        if (!response.ok) {
            throw new Error('Failed to fetch client list: ' + response.statusText);
        }
        const clients = await response.json();
        console.log('Client list fetched successfully:', clients);
        populateClientList(clients);
    } catch (error) {
        console.error('Error fetching client list:', error);
    }
}

function populateClientList(clients) {
    console.log('Populating client list...');
    const tbody = document.querySelector('#clientsTable tbody');
    tbody.innerHTML = '';
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No clients found.</td></tr>';
        return;
    }
    clients.forEach(client => {
        console.log('Adding client to table:', client);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="selectClient" data-id="${client._id}" /></td>
            <td>${client.fullName}</td>
            <td>${client.primaryPhone}</td>
            <td>${client.email}</td>
            <td>${client.preferredContactMethod}</td>
            <td>${client.resStreet}, ${client.resCity}, ${client.resState}, ${client.resZip}, ${client.resCountry}</td>
            <td>
                <button onclick="viewClient('${client._id}')">View</button>
                <button onclick="archiveClient('${client._id}')">Archive</button>
                <button onclick="deleteClient('${client._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    console.log('Client list populated.');
}

async function saveClientDetails(clientDetails) {
    console.log('Saving client details...', clientDetails);
    try {
        const response = await fetch('/api/clients/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientDetails),
        });
        if (!response.ok) {
            throw new Error('Failed to save client details: ' + response.statusText);
        }
        alert('Client details saved successfully!');
        console.log('Client details saved successfully.');
        await fetchClientList();
    } catch (error) {
        console.error('Error saving client details:', error);
    }
}

async function updateClientDetails(clientId, clientDetails) {
    console.log('Updating client details for ID:', clientId, clientDetails);
    try {
        const response = await fetch(`/api/clients/update/${clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientDetails),
        });
        if (!response.ok) {
            throw new Error('Failed to update client details: ' + response.statusText);
        }
        alert('Client details updated successfully!');
        console.log('Client details updated successfully.');
        await fetchClientList();
    } catch (error) {
        console.error('Error updating client details:', error);
    }
}

async function archiveClient(clientId) {
    console.log('Archiving client with ID:', clientId);
    try {
        const response = await fetch('/api/clients/archive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientIds: [clientId] }),
        });
        if (!response.ok) {
            throw new Error('Failed to archive client: ' + response.statusText);
        }
        alert('Client archived successfully!');
        console.log('Client archived successfully.');
        await fetchClientList();
    } catch (error) {
        console.error('Error archiving client:', error);
    }
}

async function deleteClient(clientId) {
    console.log('Deleting client with ID:', clientId);
    try {
        const response = await fetch('/api/clients/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientIds: [clientId] }),
        });
        if (!response.ok) {
            throw new Error('Failed to delete client: ' + response.statusText);
        }
        alert('Client deleted successfully!');
        console.log('Client deleted successfully.');
        await fetchClientList();
    } catch (error) {
        console.error('Error deleting client:', error);
    }
}

async function archiveClients() {
    const selectedClientIds = Array.from(document.querySelectorAll('.selectClient:checked')).map(checkbox => checkbox.dataset.id);
    console.log('Archiving selected clients with IDs:', selectedClientIds);
    if (selectedClientIds.length === 0) {
        alert('No clients selected for archiving.');
        return;
    }
    try {
        const response = await fetch('/api/clients/archive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientIds: selectedClientIds }),
        });
        if (!response.ok) {
            throw new Error('Failed to archive clients: ' + response.statusText);
        }
        alert('Clients archived successfully!');
        console.log('Clients archived successfully.');
        await fetchClientList();
    } catch (error) {
        console.error('Error archiving clients:', error);
    }
}

async function deleteClients() {
    const selectedClientIds = Array.from(document.querySelectorAll('.selectClient:checked')).map(checkbox => checkbox.dataset.id);
    console.log('Deleting selected clients with IDs:', selectedClientIds);
    if (selectedClientIds.length === 0) {
        alert('No clients selected for deletion.');
        return;
    }
    try {
        const response = await fetch('/api/clients/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientIds: selectedClientIds }),
        });
        if (!response.ok) {
            throw new Error('Failed to delete clients: ' + response.statusText);
        }
        alert('Clients deleted successfully!');
        console.log('Clients deleted successfully.');
        await fetchClientList();
    } catch (error) {
        console.error('Error deleting clients:', error);
    }
}

async function fetchArchivedClients() {
    console.log('Fetching archived clients...');
    try {
        const response = await fetch('/api/clients/archived');
        if (!response.ok) {
            throw new Error('Failed to fetch archived clients: ' + response.statusText);
        }
        const clients = await response.json();
        console.log('Archived clients fetched successfully:', clients);
        populateArchivedClientList(clients);
    } catch (error) {
        console.error('Error fetching archived clients:', error);
    }
}

function populateArchivedClientList(clients) {
    console.log('Populating archived client list...');
    const tbody = document.querySelector('#archivedClientsTable tbody');
    tbody.innerHTML = '';
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No archived clients found.</td></tr>';
        return;
    }
    clients.forEach(client => {
        console.log('Adding archived client to table:', client);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="selectArchivedClient" data-id="${client._id}" /></td>
            <td>${client.fullName}</td>
            <td>${client.primaryPhone}</td>
            <td>${client.email}</td>
            <td>${client.preferredContactMethod}</td>
            <td>${client.resStreet}, ${client.resCity}, ${client.resState}, ${client.resZip}, ${client.resCountry}</td>
            <td>
                <button onclick="reinstateClient('${client._id}')">Reinstate</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    console.log('Archived client list populated.');
}

async function reinstateClient(clientId) {
    console.log('Reinstating client with ID:', clientId);
    try {
        const response = await fetch('/api/clients/reinstate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId }),
        });
        if (!response.ok) {
            throw new Error('Failed to reinstate client: ' + response.statusText);
        }
        alert('Client reinstated successfully!');
        console.log('Client reinstated successfully.');
        await fetchArchivedClients();
    } catch (error) {
        console.error('Error reinstating client:', error);
    }
}

async function generateUniqueClientId() {
    console.log('Generating unique client ID...');
    try {
        const response = await fetch('/api/clients/generate-id');
        if (!response.ok) {
            throw new Error('Failed to generate unique client ID: ' + response.statusText);
        }
        const { clientId } = await response.json();
        console.log('Generated unique client ID:', clientId);
        return clientId;
    } catch (error) {
        console.error('Error generating unique client ID:', error);
    }
}

function viewClient(clientId) {
    console.log('Viewing client with ID:', clientId);
    alert(`Viewing client with ID: ${clientId}`);
}

function copyAddressToPostal() {
    console.log('Copying residential address to postal address...');
    document.getElementById('postStreet').value = document.getElementById('resStreet').value;
    document.getElementById('postCity').value = document.getElementById('resCity').value;
    document.getElementById('postState').value = document.getElementById('resState').value;
    document.getElementById('postZip').value = document.getElementById('resZip').value;
    document.getElementById('postCountry').value = document.getElementById('resCountry').value;
    console.log('Residential address copied to postal address.');
}

function filterClientList(query) {
    console.log('Filtering client list with query:', query);
    const rows = document.querySelectorAll('#clientsTable tbody tr');
    rows.forEach(row => {
        const cells = Array.from(row.children).map(cell => cell.textContent.toLowerCase());
        const matches = cells.some(cell => cell.includes(query));
        row.style.display = matches ? '' : 'none';
    });
}

function filterEditClientList(query) {
    console.log('Filtering edit client list with query:', query);
    const rows = document.querySelectorAll('#editClientList tr');
    rows.forEach(row => {
        const cells = Array.from(row.children).map(cell => cell.textContent.toLowerCase());
        const matches = cells.some(cell => cell.includes(query));
        row.style.display = matches ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded. Initializing...');
    fetch('/api/auth/session')
        .then(response => response.json())
        .then(data => {
            console.log('Session information fetched:', data);
            if (data.user) {
                document.getElementById('username').innerText = data.user.username;
                document.getElementById('role').innerText = data.user.role;
                document.getElementById('access').innerText = data.user.access;
                console.log('User logged in:', data.user);
            } else {
                alert('You are not logged in. Redirecting to login page.');
                window.location.href = 'portal_registration.html';
            }
        })
        .catch(error => {
            console.error('Error fetching session information:', error);
            alert('An error occurred. Please try again.');
        });

    fetchClientList()
        .then(() => {
            console.log('Client list has been fetched and populated.');
        })
        .catch(error => {
            console.error('Error occurred while fetching client list:', error);
        });

    document.getElementById('clientDetailsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submission detected. Preparing to save client details...');
        const clientDetails = {
            fullName: document.getElementById('fullName').value,
            primaryPhone: document.getElementById('primaryPhone').value,
            secondaryPhone: document.getElementById('secondaryPhone').value,
            email: document.getElementById('email').value,
            preferredContactMethod: document.getElementById('preferredContactMethod').value,
            resStreet: document.getElementById('resStreet').value,
            resCity: document.getElementById('resCity').value,
            resState: document.getElementById('resState').value,
            resZip: document.getElementById('resZip').value,
            resCountry: document.getElementById('resCountry').value,
            postStreet: document.getElementById('postStreet').value,
            postCity: document.getElementById('postCity').value,
            postState: document.getElementById('postState').value,
            postZip: document.getElementById('postZip').value,
            postCountry: document.getElementById('postCountry').value,
            archived: false,
            clientId: await generateUniqueClientId()
        };
        console.log('Client details prepared:', clientDetails);
        await saveClientDetails(clientDetails);
    });

    document.getElementById('clientSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        console.log('Client search input detected:', query);
        filterClientList(query);
    });

    document.getElementById('editClientSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        console.log('Edit client search input detected:', query);
        filterEditClientList(query);
    });

    document.getElementById('archiveButton').addEventListener('click', async () => {
        console.log('Archive button clicked.');
        await archiveClients();
    });

    document.getElementById('deleteButton').addEventListener('click', async () => {
        console.log('Delete button clicked.');
        await deleteClients();
    });

    fetchArchivedClients()
        .then(() => {
            console.log('Archived client list has been fetched and populated.');
        })
        .catch(error => {
            console.error('Error occurred while fetching archived clients:', error);
        });
});
