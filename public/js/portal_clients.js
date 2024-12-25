

// Fetch clients from the database (active or archived)
async function fetchClients(archived = false) {
    try {
        const response = await fetch(`/api/clients?archived=${archived}`);
        if (!response.ok) {
            console.error("Failed to fetch clients");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
}

// Load and display the client list
async function loadClientList() {
    const clients = await fetchClients(false); // Get active clients
    const tableBody = document.querySelector('#clientList tbody');
    tableBody.innerHTML = ''; // Clear the table body
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.phone}</td>
            <td>${client.email}</td>
            <td>
                <button onclick="loadEditClient(${client.id})">View/Edit</button>
            </td>
            <td>
                <input type="checkbox" value="${client.id}">
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add a new client
async function addClient(event) {
    event.preventDefault();
    const form = document.getElementById('addClientForm');
    const formData = new FormData(form);

    const clientData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        contactMethod: formData.get('contact_method'),
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        postcode: formData.get('postcode'),
    };

    try {
        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            throw new Error("Failed to add client");
        }

        alert("Client added successfully!");
        form.reset();
        await loadClientList();
    } catch (error) {
        console.error("Error adding client:", error);
        alert("Error adding client. Please try again.");
    }
}

// Load client details into the edit form
async function loadEditClient(clientId) {
    try {
        const response = await fetch(`/api/clients/${clientId}`);
        if (!response.ok) {
            console.error("Failed to fetch client details");
        }

        const client = await response.json();
        document.getElementById('edit_name').value = client.name;
        document.getElementById('edit_phone').value = client.phone;
        document.getElementById('edit_email').value = client.email;
        document.getElementById('edit_contact_method').value = client.contactMethod;
        document.getElementById('edit_street').value = client.street;
        document.getElementById('edit_city').value = client.city;
        document.getElementById('edit_state').value = client.state;
        document.getElementById('edit_postcode').value = client.postcode;

        // Show the edit tab
        showTab('edit_client_tab');
    } catch (error) {
        console.error("Error loading client details:", error);
        alert("Error loading client details. Please try again.");
    }
}

// Update an existing client
async function updateClient(event) {
    event.preventDefault();
    const form = document.getElementById('editClientForm');
    const formData = new FormData(form);

    const clientData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        contactMethod: formData.get('contact_method'),
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        postcode: formData.get('postcode'),
    };

    try {
        const response = await fetch(`/api/clients/${formData.get('id')}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            console.error("Failed to update client");
        }

        alert("Client updated successfully!");
        form.reset();
        await loadClientList();
        showTab('client_list_tab');
    } catch (error) {
        console.error("Error updating client:", error);
        alert("Error updating client. Please try again.");
    }
}

// Load archived clients
async function loadArchivedClients() {
    const clients = await fetchClients(true); // Get archived clients
    const archiveContainer = document.getElementById('archivedClients');
    archiveContainer.innerHTML = ''; // Clear the container
    clients.forEach(client => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div>
                ${client.name} (${client.email})
                <button onclick="reactivateClient(${client.id})">Reactivate</button>
            </div>
        `;
        archiveContainer.appendChild(div);
    });
}

// Reactivate a client
async function reactivateClient(clientId) {
    try {
        const response = await fetch(`/api/clients/${clientId}/reactivate`, { method: 'POST' });
        if (!response.ok) {
            console.error("Failed to reactivate client");
        }

        alert("Client reactivated successfully!");
        await loadArchivedClients();
        await loadClientList();
    } catch (error) {
        console.error("Error reactivating client:", error);
        alert("Error reactivating client. Please try again.");
    }
}

// Event listeners
document.getElementById('addClientForm').addEventListener('submit', addClient);
document.getElementById('editClientForm').addEventListener('submit', updateClient);

// Initial load of the client list
document.addEventListener('DOMContentLoaded', () => {
    loadClientList();
    document.getElementById('archiveSearch').addEventListener('input', loadArchivedClients);
});
