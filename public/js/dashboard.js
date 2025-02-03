// File: js/dashboard.js

let timerInterval;
let startTime;

document.addEventListener('DOMContentLoaded', async () => {
    await populateProjectDropdown();
    checkActiveSession();
});

async function populateProjectDropdown() {
    try {
        const response = await fetch('/api/projects/list');
        if (!response.ok) throw new Error('Failed to fetch projects.');

        const projects = await response.json();
        const projectSelect = document.getElementById('project_select');
        projectSelect.innerHTML = ''; // Clear existing options

        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.projectID;
            option.textContent = `${project.customer} - ${project.title}`;
            projectSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching project data:', error);
    }
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const timer = document.getElementById('timer');
    const elapsedTime = new Date(new Date() - startTime);
    const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');
    timer.textContent = `${hours}:${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}
async function clockIn() {
    const projectSelect = document.getElementById('project_select');
    const selectedOption = projectSelect.options[projectSelect.selectedIndex];
    const projectID = selectedOption.value;
    const [customer, projectTitle] = selectedOption.textContent.split(' - ');

    const timeLog = {
        projectId: projectID,
        projectTitle: projectTitle,
        customer: customer,
        clientId: 'actualClientId', // Replace with actual clientId
        projectSite: 'actualProjectSite', // Replace with actual projectSite
        username: document.getElementById('username').textContent,
        status: 'clockedIn',
        action: 'clockin',
        timestamp: new Date(),
    };

    try {
        const response = await fetch('/api/timelogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(timeLog),
        });

        if (!response.ok) throw new Error('Failed to clock in');

        document.getElementById('project_title_display').textContent = projectTitle;
        startTimer();
    } catch (error) {
        console.error('Error during clock in:', error);
    }
}

async function clockOut() {
    const projectSelect = document.getElementById('project_select');
    const selectedOption = projectSelect.options[projectSelect.selectedIndex];
    const projectID = selectedOption.value;
    const [customer, projectTitle] = selectedOption.textContent.split(' - ');

    const timeLog = {
        projectId: projectID,
        projectTitle: projectTitle,
        customer: customer,
        clientId: 'actualClientId', // Replace with actual clientId
        projectSite: 'actualProjectSite', // Replace with actual projectSite
        username: document.getElementById('username').textContent,
        status: 'clockedOut',
        action: 'clockout',
        timestamp: new Date(),
    };

    try {
        const response = await fetch('/api/timelogs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(timeLog),
        });

        if (!response.ok) throw new Error('Failed to clock out');

        stopTimer();
        document.getElementById('project_title_display').textContent = 'No project selected';
        document.getElementById('timer').textContent = '00:00:00';
    } catch (error) {
        console.error('Error during clock out:', error);
    }
}

async function checkActiveSession() {
    // Fetch active time log if any and continue the timer
    try {
        const response = await fetch('/api/timelogs/active');
        if (!response.ok) throw new Error('Failed to fetch active session');

        const activeLog = await response.json();
        if (activeLog) {
            document.getElementById('project_title_display').textContent = activeLog.projectTitle;
            startTime = new Date(activeLog.timestamp);
            startTimer();
        }
    } catch (error) {
        console.error('Error checking active session:', error);
    }
}