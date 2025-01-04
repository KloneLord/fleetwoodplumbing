document.addEventListener('DOMContentLoaded', async () => {
    await populateClientDropdown();
    document.getElementById('clientDropdown').addEventListener('change', async () => {
        updateClientIDField();
        await loadProjectSites(document.getElementById('clientDropdown').value);
    });

    document.getElementById('projectSiteForm').addEventListener('submit', handleFormSubmit);
    await generateAndSetSiteId();
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
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.clientId;
            option.textContent = client.fullName;
            clientDropdown.appendChild(option);
        });

        if (clients.length > 0) {
            document.getElementById('clientID').value = clients[0].clientId;
            document.getElementById('clientDropdown').dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
    }
}

// Function to update clientID field when the dropdown selection changes
function updateClientIDField() {
    const clientDropdown = document.getElementById('clientDropdown');
    const selectedClientID = clientDropdown.value;
    document.getElementById('clientID').value = selectedClientID;
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const clientDropdown = document.getElementById('clientDropdown');
    const clientID = clientDropdown.value;
    const clientName = clientDropdown.options[clientDropdown.selectedIndex].text;

    const projectSite = {
        siteId: document.getElementById('siteId').value, // Use generated siteId
        clientID,
        clientName,
        siteName: formData.get('siteName'),
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

        await loadProjectSites(clientID);
        event.target.reset();
        updateClientIDField();
        await generateAndSetSiteId(); // Generate new siteId for the next entry
    } catch (error) {
        console.error('Error saving project site:', error);
    }
}

// Function to load project sites for a selected client
async function loadProjectSites(clientID) {
    try {
        const response = await fetch(`/api/project_sites/client/${clientID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch project sites');
        }
        const projectSites = await response.json();
        const projectSitesTableBody = document.getElementById('projectSitesTableBody');
        projectSitesTableBody.innerHTML = '';

        projectSites.forEach(projectSite => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${projectSite.clientName}</td>
                <td>${projectSite.clientID}</td>
                <td>${projectSite.siteId}</td>
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
    } catch (error) {
        console.error('Error deleting project site:', error);
    }
}

// Function to generate and set a 16-character siteId
async function generateAndSetSiteId() {
    try {
        const response = await fetch('/api/site-id/generate');
        if (!response.ok) {
            throw new Error('Failed to generate siteId');
        }
        const { siteId } = await response.json();
        document.getElementById('siteId').value = siteId; // Set generated siteId in the form
    } catch (error) {
        console.error('Error generating siteId:', error);
        throw error;
    }
}


// Initialize Forms
async function initializeForms() {
    document.getElementById('siteId').value = await generateAuthCode();
    await loadProjectSites();
    await populateClientDropdown();
    await updateClientIDField();
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeForms);