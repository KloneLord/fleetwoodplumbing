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

async function fetchProjectDetails(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project details.');

        const project = await response.json();
        const projectTab = document.getElementById('project_tab_content');
        projectTab.innerHTML = '';

        // Dynamically create elements for each field in the project object
        Object.keys(project).forEach(key => {
            const div = document.createElement('div');
            div.classList.add('project-detail-row');

            const label = document.createElement('label');
            label.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;
            label.classList.add('project-detail-label');

            const span = document.createElement('span');
            span.textContent = project[key];
            span.classList.add('project-detail-value');

            div.appendChild(label);
            div.appendChild(span);
            projectTab.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectID');
    if (projectId) {
        fetchProjectDetails(projectId);
    }

    // Default to showing the first tab or a specific tab from the URL parameter
    const tabId = urlParams.get('tab') || 'project_tab';
    showTab(tabId);
});

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