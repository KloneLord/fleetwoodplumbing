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
                    <a href="portal_projects_card.html?projectID=${project.projectID}" class="slim-styled-button" onclick="console.log('Viewing project: ${project.projectID}')">View</a>
                    <button class="slim-styled-button" onclick="console.log('Editing project: ${project.projectID}'); editProject('${project.projectID}')">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching project list:', error);
    }
}

async function editProject(projectID) {
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