document.addEventListener('DOMContentLoaded', async () => {
    // Fetch session information from the server
    try {
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();

        if (sessionData.user) {
            document.getElementById('username').innerText = sessionData.user.username;
            document.getElementById('role').innerText = sessionData.user.role;
            document.getElementById('access').innerText = sessionData.user.access;
        } else {
            alert('You are not logged in. Redirecting to login page.');
            window.location.href = 'portal_login.html';
        }
    } catch (error) {
        console.error('Error fetching session information:', error);
        alert('An error occurred. Please try again.');
    }

    // Populate customer dropdowns
    //await populateCustomerDropdown('customer');
    //await populateCustomerDropdown('edit_customer');

    // Fetch project lists
    await fetchProjectList();
    await fetchArchivedProjects();

});

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
        dropdown.innerHTML = ''; // Clear any existing options
        activeClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.clientId; // Set the value of the option to clientId
            option.textContent = client.fullName; // Display the fullName
            dropdown.appendChild(option);
        });
    });
}

// Call the function to fetch and populate client names when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', populateClientDropdowns);



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