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

async function initializeForms() {
    await fetchProjectList();
    await populateClientDropdowns();
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

// Event listener for DOM content loaded to fill the projectID
document.addEventListener('DOMContentLoaded', async () => {
    await fillProjectID();
});

// Function to populate project site table based on client ID in the clientId input text box
async function populateProjectSiteTable(clientId) {
    if (!clientId) return;

    try {
        console.log(`Fetching project sites for clientId: ${clientId}`);
        const response = await fetch(`/api/project_sites/client/${clientId}`);
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
                <td><button class="select-button" data-id="${site.siteId}">Select</button></td>
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
            button.classList.add('selected'); // Add selected class to button
            document.getElementById('selectedSiteId').value = selectedSiteId; // Set the selected site ID in a hidden input
        } else {
            row.style.opacity = '0.5';
            button.classList.remove('selected'); // Remove selected class from button
        }
    });
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

// Function to fetch and display the project list
async function fetchProjectList() {
    try {
        const response = await fetch('/api/projects/list');
        if (!response.ok) throw new Error('Failed to fetch projects.');

        const projects = await response.json();
        const tbody = document.querySelector('#projectTable tbody');
        tbody.innerHTML = '';

        const activeProjects = projects.filter(project => project.status !== 'Archived');

        if (activeProjects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No projects found.</td></tr>';
            return;
        }

        activeProjects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="width: 5%;"><input type="checkbox" name="selectProject" value="${project.projectID}"></td>
                <td style="width: 5%;">${project.projectID}</td>
                <td style="width: 20%;">${project.title}</td>
                <td style="width: 15%;">${project.customer}</td>
                <td style="width: 20%;">${project.projectSite}</td>
                <td style="width: 15%;">${project.status}</td>
                <td style="width: 20%;">
                    <a href="portal_projects_card.html?projectID=${project.projectID}" class="slim-styled-button">View</a>
                    <button class="slim-styled-button" onclick="editProject('${project.projectID}')">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching project list:', error);
    }
}
const project = 10000;
async function editProject(project) {
    console.log(`Editing project with ID: ${projectID}`);
    // Show the edit project tab
    showTab('edit_project_tab');
    console.log('Switched to edit project tab');

    try {
        // Fetch project details from the database
        const response = await fetch(`/api/projects/${projectID}`);
        if (!response.ok) throw new Error('Failed to fetch project details.');

        const project = await response.json();
        console.log('Fetched project details:', project);

        // Populate the edit project form with project details
        document.getElementById('editProjectID').value = project.projectID;
        document.getElementById('editProjectTitle').value = project.title;
        document.getElementById('editClientId').value = project.clientId;
        document.getElementById('editDescription').value = project.description;
        document.getElementById('editStatus').value = project.status;

        // Populate clients dropdown and select the current client
        const clientsDropdown = document.getElementById('edit_clientsDropdown');
        clientsDropdown.innerHTML = '<option value="">Pick one</option>';
        const activeClients = await fetchClientNames();
        activeClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.clientId;
            option.textContent = client.fullName;
            if (client.clientId === project.clientId) {
                option.selected = true;
            }
            clientsDropdown.appendChild(option);
        });
        console.log('Populated clients dropdown');

        // Populate project sites table
        await populateProjectSiteTable(project.clientId);
        console.log('Populated project sites table');

        // Select the current project site
        document.getElementById('editSelectedSiteId').value = project.projectSiteId;
        const rows = document.querySelectorAll('#editProjectSitesTableBody tr');
        rows.forEach(row => {
            const button = row.querySelector('.select-button');
            if (button.getAttribute('data-id') === project.projectSiteId) {
                row.style.opacity = '1';
                button.classList.add('selected');
            } else {
                row.style.opacity = '0.5';
                button.classList.remove('selected');
            }
        });
        console.log('Selected current project site');
    } catch (error) {
        console.error('Error fetching project details:', error);
    }
}

async function handleEditProjectFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('Edit project form submitted');

    // Gather form data
    const formData = new FormData(event.target);
    const selectedSiteId = document.getElementById('editSelectedSiteId').value;
    if (!selectedSiteId) {
        alert('Please select a project site before submitting.');
        return;
    }

    const projectID = formData.get('projectID');
    const project = {
        title: formData.get('title'),
        customer: formData.get('clientsDropdown'),
        clientId: formData.get('clientId'),
        projectSite: selectedSiteId, // Get selected project site ID
        description: formData.get('description'),
        status: formData.get('status')
    };
    console.log('Project data to update:', project);

    try {
        // Send the data to the backend API
        const response = await fetch(`/api/projects/${projectID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });

        if (!response.ok) throw new Error('Failed to update project.');

        console.log('Project updated successfully');
        await fetchProjectList(); // Refresh the project list
        showTab('project_list_tab'); // Switch back to the project list tab
    } catch (error) {
        console.error('Error updating project:', error);
    }
}

// Function to filter the project list based on the search input
function filterProjectList() {
    const searchValue = document.getElementById('projectSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#projectTable tbody tr');

    rows.forEach(row => {
        const title = row.cells[1].textContent.toLowerCase();
        const customer = row.cells[2].textContent.toLowerCase();
        const projectSite = row.cells[3].textContent.toLowerCase();
        const status = row.cells[4].textContent.toLowerCase();

        if (title.includes(searchValue) || customer.includes(searchValue) || projectSite.includes(searchValue) || status.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to select or deselect all rows
function selectAllRows(checkbox) {
    const checkboxes = document.querySelectorAll('#projectTable tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Function to delete selected projects
async function deleteSelectedProjects() {
    const selected = getSelectedProjects();
    if (selected.length === 0) {
        alert('No projects selected.');
        return;
    }
    // Add your delete logic here with selected IDs
    console.log('Deleting projects:', selected);
}

// Function to archive selected projects
async function archiveSelectedProjects() {
    const selected = getSelectedProjects();
    if (selected.length === 0) {
        alert('No projects selected.');
        return;
    }

    try {
        await Promise.all(selected.map(async (projectID) => {
            const response = await fetch(`/api/projects/${projectID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Archived' })
            });

            if (!response.ok) throw new Error(`Failed to archive project ID ${projectID}`);
        }));

        await fetchProjectList(); // Refresh the project list
    } catch (error) {
        console.error('Error archiving selected projects:', error);
    }
}

async function archiveProject(projectID) {
    try {
        const response = await fetch(`/api/projects/${projectID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Archived' })
        });

        if (!response.ok) throw new Error('Failed to archive project.');

        await fetchProjectList(); // Refresh the project list
    } catch (error) {
        console.error('Error archiving project:', error);
    }
}

// Helper function to get selected project IDs
function getSelectedProjects() {
    const selected = [];
    const checkboxes = document.querySelectorAll('#projectTable tbody input[type="checkbox"]:checked');
    checkboxes.forEach(cb => selected.push(cb.value));
    return selected;
}

// Call fetchProjectList when the page loads
document.addEventListener('DOMContentLoaded', fetchProjectList);

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
                    <button class="slim-styled-button" onclick="reinstateArchivedProject('${project.projectID}')">Reinstate</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching archived projects:', error);
    }
}

// Function to reinstate archived projects
async function reinstateArchivedProject(projectID) {
    try {
        const response = await fetch(`/api/projects/reinstate/${projectID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to reinstate project');

        await fetchArchivedProjects();
    } catch (error) {
        console.error('Error reinstating project:', error);
    }
}

// Function to handle form submission for adding a new project
async function handleAddProjectFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Gather form data
    const formData = new FormData(event.target);
    const selectedSiteId = document.getElementById('siteId').value;
    const siteDropdown = document.getElementById('siteDropdown');
    const selectedSite = siteDropdown.options[siteDropdown.selectedIndex].text;
    const clientsDropdown = document.getElementById('clientsDropdown');
    const customerName = clientsDropdown.options[clientsDropdown.selectedIndex].text;

    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = ''; // Clear any previous messages

    if (!selectedSiteId) {
        formMessage.innerHTML = '<p style="color: red;">Please select a project site before submitting.</p>';
        return;
    }
    if (!selectedSite) {
        formMessage.innerHTML = '<p style="color: red;">Please select a project site before submitting.</p>';
        return;
    }

    const project = {
        title: formData.get('title'),
        projectID: formData.get('projectID'),
        customer: customerName,
        clientId: formData.get('clientId'),
        projectSite: selectedSite, // Get selected project site name
        projectSiteId: selectedSiteId, // Get selected project site ID
        description: formData.get('description'),
        status: formData.get('status')
    };

    try {
        // Send the data to the backend API
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });

        if (!response.ok) throw new Error('Failed to save project.');

        await fetchProjectList(); // Refresh the project list
        event.target.reset(); // Reset the form
        document.getElementById('projectID').value = await generateAuthCode(); // Generate a new project ID for the next project
        formMessage.innerHTML = '<p style="color: green;">Project added successfully!</p>';
    } catch (error) {
        console.error('Error saving project:', error);
        formMessage.innerHTML = '<p style="color: red;">Error saving project. Please try again.</p>';
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
// Function to fetch and return the names and IDs of project sites filtered by clientId
async function fetchProjectSites(clientId) {
    try {
        const response = await fetch(`/api/project_sites/client/${clientId}`);
        if (!response.ok) throw new Error('Failed to fetch project sites.');

        const projectSites = await response.json();
        const filteredProjectSites = projectSites
            .map(site => ({
                siteId: site.siteId,
                siteName: site.siteName,
                streetAddress: site.streetAddress,
                cityTown: site.cityTown,
                postcode: site.postcode,
                state: site.state,
                country: site.country
            }));

        console.log('Filtered Project Sites:', filteredProjectSites);
        return filteredProjectSites;
    } catch (error) {
        console.error('Error fetching project sites:', error);
        return [];
    }
}

// Function to populate the dropdowns with client names
async function populateClientDropdowns() {
    const activeClients = await fetchClientNames();
    const clientsDropdown = document.getElementById('clientsDropdown');
    clientsDropdown.innerHTML = '<option value="">Pick one</option>'; // Add default option

    activeClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.clientId; // Set the value of the option to clientId
        option.textContent = client.fullName; // Display the fullName
        clientsDropdown.appendChild(option);
    });

    // Trigger the change event to load project sites and client ID
    clientsDropdown.addEventListener('change', async (event) => {
        const selectedClientId = event.target.value;
        document.getElementById('clientId').value = selectedClientId;
        await populateProjectSiteDropdown(selectedClientId);
    });
}

// Function to populate the project sites dropdown
async function populateProjectSiteDropdown(clientId) {
    const projectSites = await fetchProjectSites(clientId);
    const siteDropdown = document.getElementById('siteDropdown');
    siteDropdown.innerHTML = '<option value="">Pick one</option>'; // Add default option

    projectSites.forEach(site => {
        const option = document.createElement('option');
        option.value = site.siteId; // Set the value of the option to siteId
        option.textContent = site.siteName; // Display the siteName
        siteDropdown.appendChild(option);
    });

    // Trigger the change event to load the site ID and site details
    siteDropdown.addEventListener('change', (event) => {
        const selectedSiteId = event.target.value;
        document.getElementById('siteId').value = selectedSiteId;
        populateProjectSiteDetails(selectedSiteId, projectSites);
    });
}

// Function to populate the project site details in the table
function populateProjectSiteDetails(siteId, projectSites) {
    const selectedSite = projectSites.find(site => site.siteId === siteId);
    if (selectedSite) {
        const tbody = document.getElementById('projectSitesTableBody');
        tbody.innerHTML = ''; // Clear existing rows

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${selectedSite.siteName}</td>
            <td>${selectedSite.streetAddress}</td>
            <td>${selectedSite.cityTown}</td>
            <td>${selectedSite.postcode}</td>
            <td>${selectedSite.state}</td>
            <td>${selectedSite.country}</td>
            <td><button class="select-button" data-id="${selectedSite.siteId}">Select</button></td>
        `;
        tbody.appendChild(row);
    }
}

// Function to fill the projectID input with the generated auth code
async function fillProjectID() {
    try {
        const authCode = await generateAuthCode();
        document.getElementById('projectID').value = authCode;
    } catch (error) {
        console.error('Error filling project ID:', error.message);
    }
}

// Event listener for DOM content loaded to fill the projectID and populate client dropdowns
document.addEventListener('DOMContentLoaded', async () => {
    await fetchSession();
    await fillProjectID();
    await populateClientDropdowns();

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
