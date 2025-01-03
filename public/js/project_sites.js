document.addEventListener('DOMContentLoaded', async () => {
    await populateClientDropdown();
    document.getElementById('clientDropdown').addEventListener('change', async () => {
        updateClientIDField();
        await loadProjectSites(document.getElementById('clientDropdown').value);
    });
    document.getElementById('projectSiteForm').addEventListener('submit', handleFormSubmit);
});

// Function to populate client dropdown
async function populateClientDropdown() {
    const clientDropdown = document.getElementById('clientDropdown');

    try {
        const response = await fetch('/api/clients/list');
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }
        const clients = await response.json();
        console.log('Fetched clients:', clients);

        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.clientId;
            option.textContent = client.fullName; // Use fullName for the dropdown text
            clientDropdown.appendChild(option);
        });

        // Update clientID field and load project sites with the first client's ID if available
        if (clients.length > 0) {
            document.getElementById('clientID').value = clients[0].clientId;
            document.getElementById('clientDropdown').dispatchEvent(new Event('change'));
        }

        console.log('Dropdown options:', clientDropdown.innerHTML);
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}

// Function to update clientID field when the dropdown selection changes
function updateClientIDField() {
    const clientDropdown = document.getElementById('clientDropdown');
    const selectedClientID = clientDropdown.value;
    document.getElementById('clientID').value = selectedClientID;
    console.log('Client ID updated to:', selectedClientID);
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const clientDropdown = document.getElementById('clientDropdown');
    const clientID = clientDropdown.value;
    const fullName = clientDropdown.options[clientDropdown.selectedIndex].text;

    const projectSite = {
        fullName: fullName,
        clientID: clientID,
        siteName: formData.get('siteName'), // Get site name from the form
        streetAddress: formData.get('streetAddress'),
        cityTown: formData.get('cityTown'),
        postcode: formData.get('postcode'),
        state: formData.get('state'),
        country: formData.get('country')
    };

    try {
        const response = await fetch('/api/project_sites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectSite)
        });

        if (!response.ok) {
            throw new Error('Failed to save project site');
        }

        const savedProjectSite = await response.json();
        console.log('Saved project site:', savedProjectSite);
        await loadProjectSites(clientID);
        event.target.reset();
        // Update clientID field with the selected client's ID
        updateClientIDField();
    } catch (error) {
        console.error('Error saving project site:', error);
    }
}

// Function to load project sites for a selected client
async function loadProjectSites(clientID) {
    try {
        console.log('Loading project sites for client ID:', clientID);
        const response = await fetch(`/api/project_sites/${clientID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch project sites');
        }
        const projectSites = await response.json();
        console.log('Fetched project sites:', projectSites);
        const projectSitesTableBody = document.getElementById('projectSitesTableBody');

        projectSitesTableBody.innerHTML = '';

        projectSites.forEach(projectSite => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${projectSite.fullName}</td>
                <td>${projectSite.clientID}</td>
                <td>${projectSite.siteName}</td>
                <td>${projectSite.streetAddress}</td>
                <td>${projectSite.cityTown}</td>
                <td>${projectSite.postcode}</td>
                <td>${projectSite.state}</td>
                <td>${projectSite.country}</td>
                <td><button class="delete-button" data-id="${projectSite._id}">Delete</button></td>
            `;

            projectSitesTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const projectId = event.target.getAttribute('data-id');
                await deleteProjectSite(projectId);
                await loadProjectSites(clientID);
                // Update clientID field with the selected client's ID
                updateClientIDField();
            });
        });
    } catch (error) {
        console.error('Error loading project sites:', error);
    }
}

// Function to delete a project site
async function deleteProjectSite(id) {
    try {
        const response = await fetch(`/api/project_sites/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete project site');
        }

        console.log('Project site deleted');
    } catch (error) {
        console.error('Error deleting project site:', error);
    }
}