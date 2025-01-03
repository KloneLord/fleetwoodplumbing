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

// Function to filter the project list
function filterProjectList() {
    const searchValue = document.getElementById('projectSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#projectTable tbody tr');

    rows.forEach(row => {
        const projectTitle = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const customer = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const address = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

        if (projectTitle.includes(searchValue) || customer.includes(searchValue) || address.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to generate an auth code
async function generateAuthCode(requestSource = 'project') {
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

// Function to fetch and return the names and IDs of active clients
async function fetchClientNames() {
    try {
        const response = await fetch('/api/clients/list');
        if (!response.ok) throw new Error('Failed to fetch clients.');

        const clients = await response.json();
        const activeClients = clients
            .filter(client => client.accountStatus === 'active')
            .map(client => ({ clientId: client.clientId, fullName: client.fullName }));

        console.log('Active Clients:', activeClients);
        return activeClients;
    } catch (error) {
        console.error('Error fetching client names:', error);
        return [];
    }
}

// Function to populate the dropdowns with client names
async function populateClientDropdowns() {
    const activeClients = await fetchClientNames();
    const dropdowns = [document.getElementById('clientsDropdown'), document.getElementById('edit_clientsDropdown')];

    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Pick one</option>'; // Add default option
        activeClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.clientId; // Set the value of the option to clientId
            option.textContent = client.fullName; // Display the fullName
            dropdown.appendChild(option);
        });
    });

    // Trigger the change event to load project sites and client ID
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', async (event) => {
            const selectedClientId = event.target.value;
            document.getElementById('clientId').value = selectedClientId;
            await populateProjectSiteTable(selectedClientId);
        });
    });
}

// Function to populate project site table based on client ID in the clientId input text box
async function populateProjectSiteTable(clientId) {
    if (!clientId) return;

    try {
        console.log(`Fetching project sites for clientId: ${clientId}`);
        const response = await fetch(`/api/project_sites/${clientId}`);
        if (!response.ok) throw new Error('Failed to fetch project sites.');

        const projectSites = await response.json();
        console.log('Fetched Project Sites:', projectSites); // Log fetched project sites for debugging

        const tableBody = document.getElementById('projectSitesTableBody');
        tableBody.innerHTML = '';

        projectSites.forEach(site => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${site.siteName}</td>
                <td>${site.streetAddress}</td>
                <td>${site.cityTown}</td>
                <td>${site.postcode}</td>
                <td>${site.state}</td>
                <td>${site.country}</td>
                <td><button class="select-button" data-id="${site._id}">Select</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listener to select buttons
        const selectButtons = document.querySelectorAll('.select-button');
        selectButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const selectedSiteId = event.target.getAttribute('data-id');
                selectProjectSite(selectedSiteId);
            });
        });
    } catch (error) {
        console.error('Error fetching project sites:', error);
    }
}

// Function to handle project site selection
function selectProjectSite(selectedSiteId) {
    const rows = document.querySelectorAll('#projectSitesTableBody tr');
    rows.forEach(row => {
        const button = row.querySelector('.select-button');
        if (button.getAttribute('data-id') === selectedSiteId) {
            row.style.opacity = '1';
        } else {
            row.style.opacity = '0.5';
        }
    });
}

// Initialize Forms
async function initializeForms() {
    document.getElementById('projectID').value = await generateAuthCode();
    await fetchProjectList();
    await populateClientDropdowns();
}

// Function to fetch session information
async function fetchSession() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (data.user) {
            document.getElementById('username').innerText = data.user.username;
            document.getElementById('role').innerText = data.user.role;
            document.getElementById('access').innerText = data.user.access;
        } else {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'portal_login.html';
        }
    } catch (error) {
        console.error('Error fetching session information:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function to log out
async function logOut() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to log out');

        alert('You have been logged out successfully!');
        window.location.href = 'portal_login.html';
    } catch (error) {
        console.error('Error during logout:', error.message);
        alert('An error occurred while logging out. Please try again.');
    }
}

// Function to fetch project list
async function fetchProjectList() {
    try {
        const response = await fetch('/api/projects/list');
        if (!response.ok) throw new Error('Failed to fetch projects.');

        const projects = await response.json();
        const tbody = document.querySelector('#projectTable tbody');
        tbody.innerHTML = '';

        if (projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No projects found.</td></tr>';
            return;
        }

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="width: 5%;"><input type="checkbox" name="selectProject" value="${project.projectId}"></td>
                <td style="width: 25%;">${project.title}</td>
                <td style="width: 25%;">${project.customer}</td>
                <td style="width: 35%;">${project.address}</td>
                <td style="width: 10%;">
                    <button class="slim-styled-button" onclick="viewProject('${project.projectId}')">View</button>
                    <button class="slim-styled-button" onclick="archiveProject('${project.projectId}')">Archive</button>
                    <button class="slim-styled-button" onclick="deleteProject('${project.projectId}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching project list:', error);
    }
}

// Function to fetch archived projects
async function fetchArchivedProjects() {
    try {
        const response = await fetch('/api/projects/archived');
        if (!response.ok) throw new Error('Failed to fetch archived projects.');

        const projects = await response.json();
        const tbody = document.querySelector('#archivedProjectsTable tbody');
        tbody.innerHTML = '';

        if (projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No archived projects found.</td></tr>';
            return;
        }

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="width: 25%;">${project.title}</td>
                <td style="width: 25%;">${project.customer}</td>
                <td style="width: 35%;">${project.address}</td>
                <td style="width: 15%;">
                    <button class="slim-styled-button" onclick="reinstateArchivedProject('${project.projectId}')">Reinstate</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching archived projects:', error);
    }
}

// Function to handle form submission for adding a new project
async function handleAddProjectFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const project = {
        title: formData.get('title'),
        projectId: formData.get('projectID'),
        customer: formData.get('clientsDropdown'),
        customerId: formData.get('clientId'),
        // The selected project site ID should be retrieved from the selected row in the table
        projectSite: document.querySelector('#projectSitesTableBody .select-button.selected').getAttribute('data-id'),
        description: formData.get('description'),
        status: formData.get('status')
    };

    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });

        if (!response.ok) throw new Error('Failed to save project.');

        await fetchProjectList();
        event.target.reset();
        generateProjectID(); // Generate a new project ID for the next project
    } catch (error) {
        console.error('Error saving project:', error);
    }
}

// Function to handle form submission for editing a project
async function handleEditProjectFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const projectId = formData.get('projectID');
    const project = {
        title: formData.get('title'),
        customer: formData.get('clientsDropdown'),
        customerId: formData.get('clientId'),
        // The selected project site ID should be retrieved from the selected row in the table
        projectSite: document.querySelector('#edit_projectSitesTableBody .select-button.selected').getAttribute('data-id'),
        description: formData.get('description'),
        status: formData.get('status')
    };

    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });

        if (!response.ok) throw new Error('Failed to update project.');

        await fetchProjectList();
    } catch (error) {
        console.error('Error updating project:', error);
    }
}

// Function to select all rows
function selectAllRows(checkbox) {
    const checkboxes = document.querySelectorAll('#projectTable tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Function to delete selected projects
async function deleteSelectedProjects() {
    const selectedIds = Array.from(document.querySelectorAll('#projectTable tbody input[type="checkbox"]:checked'))
        .map(cb => cb.closest('tr').querySelector('td:nth-child(2)').textContent);

    try {
        const response = await fetch('/api/projects/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (!response.ok) throw new Error('Failed to delete projects');

        await fetchProjectList();
    } catch (error) {
        console.error('Error deleting projects:', error);
    }
}

// Function to archive selected projects
async function archiveSelectedProjects() {
    const selectedIds = Array.from(document.querySelectorAll('#projectTable tbody input[type="checkbox"]:checked'))
        .map(cb => cb.closest('tr').querySelector('td:nth-child(2)').textContent);

    try {
        const response = await fetch('/api/projects/archive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (!response.ok) throw new Error('Failed to archive projects');

        await fetchProjectList();
        await fetchArchivedProjects();
    } catch (error) {
        console.error('Error archiving projects:', error);
    }
}

// Function to reinstate archived projects
async function reinstateArchivedProject(projectId) {
    try {
        const response = await fetch(`/api/projects/reinstate/${projectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to reinstate project');

        await fetchArchivedProjects();
    } catch (error) {
        console.error('Error reinstating project:', error);
    }
}

// Function to view a project
function viewProject(projectId) {
    sessionStorage.setItem('projectId', projectId);
    window.location.href = 'portal_projects_card.html';
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async () => {
    await fetchSession();
    await initializeForms();

    // Default to showing the first tab or a specific tab from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabId = urlParams.get('tab') || 'project_list_tab'; // Default tab
    showTab(tabId);

    document.getElementById('projectSearch').addEventListener('input', filterProjectList);
    document.getElementById('logOutButton').addEventListener('click', logOut);

    // Add event listeners for tab buttons
    document.querySelectorAll('.tab-buttons button').forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = event.target.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Add event listener for add project form submission
    document.getElementById('addProjectForm').addEventListener('submit', handleAddProjectFormSubmit);

    // Add event listener for edit project form submission
    document.getElementById('editProjectForm').addEventListener('submit', handleEditProjectFormSubmit);
});