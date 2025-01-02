document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProjectSiteForm');
    const clientDropdown = document.getElementById('clientDropdown');
    const projectSitesTableBody = document.getElementById('projectSitesTable').querySelector('tbody');

    // Function to fetch and display project sites
    async function loadProjectSites(clientId) {
        try {
            const response = await fetch(`/api/project_sites/${clientId}`);
            if (!response.ok) throw new Error('Failed to fetch project sites.');

            const projectSites = await response.json();
            projectSitesTableBody.innerHTML = ''; // Clear existing rows

            projectSites.forEach(site => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${site.project_site_address_name}</td>
                    <td>${site.project_site_street}</td>
                    <td>${site.project_site_city}</td>
                    <td>${site.project_site_postcode}</td>
                    <td>${site.project_site_state}</td>
                    <td>${site.project_site_country}</td>
                    <td><button onclick="deleteProjectSite('${site._id}')">Delete</button></td>
                `;
                projectSitesTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching project sites:', error);
        }
    }

    // Function to delete a project site
    window.deleteProjectSite = async function (projectId) {
        if (confirm('Are you sure you want to delete this project site?')) {
            try {
                const response = await fetch(`/api/project_sites/${projectId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Project site deleted successfully!');
                    loadProjectSites(clientDropdown.value); // Refresh the table
                } else {
                    alert('Failed to delete project site.');
                }
            } catch (error) {
                console.error('Error deleting project site:', error);
                alert('An error occurred while deleting the project site.');
            }
        }
    };

    // Function to populate the client dropdowns
    async function sitesPopulateClientDropdowns() {
        try {
            const response = await fetch('/api/clients/list');
            if (!response.ok) throw new Error('Failed to fetch clients.');

            const clients = await response.json();
            clientDropdown.innerHTML = ''; // Clear any existing options

            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.clientId; // Set the value of the option to clientId
                option.textContent = client.fullName; // Display the fullName
                clientDropdown.appendChild(option);
            });

            // Automatically load project sites for the first client in the dropdown
            if (clients.length > 0) {
                clientDropdown.value = clients[0].clientId;
                loadProjectSites(clients[0].clientId);
            }
        } catch (error) {
            console.error('Error fetching client names:', error);
        }
    }

    // Populate client dropdowns when the DOM is fully loaded
    sitesPopulateClientDropdowns();

    clientDropdown.addEventListener('change', () => {
        loadProjectSites(clientDropdown.value);
    });

    // Handle project site form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const projectSiteData = {
            projectSiteTitle: form.projectSiteTitle.value,
            streetAddress: form.streetAddress.value,
            city: form.city.value,
            postcode: form.postcode.value,
            state: form.state.value,
            country: form.country.value,
            clientId: clientDropdown.value,
            fullName: clientDropdown.options[clientDropdown.selectedIndex].text
        };

        try {
            const response = await fetch('/api/project_sites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectSiteData)
            });

            if (response.ok) {
                alert('Project site saved successfully!');
                form.reset();
                loadProjectSites(clientDropdown.value); // Refresh the table
            } else {
                alert('Failed to save project site.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the project site.');
        }
    });
});