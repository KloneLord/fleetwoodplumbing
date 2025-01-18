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

    document.addEventListener('DOMContentLoaded', async () => {
    // Fetch session information from the server
    fetch('/api/auth/session')
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                document.getElementById('username').innerText = data.user.username;
                document.getElementById('role').innerText = data.user.role;
                document.getElementById('access').innerText = data.user.access;
                // Load data into tables
                loadTasks();
                loadMaterials();
                loadPlantEquipment();
                loadTimeLogs();
                loadPlans();
                loadInvoices();
            } else {
                alert('You are not logged in. Redirecting to login page.');
                window.location.href = 'portal_login.html';
            }
        })
        .catch(error => {
            console.error('Error fetching session information:', error);
            alert('An error occurred. Please try again.');
        });

    // Load data functions
    async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const tasksTableBody = document.getElementById('tasks_table_body');
    tasksTableBody.innerHTML = '';
    tasks.forEach(task => {
    const row = `<tr>
          <td>${task.task}</td>
          <td>${task.details}</td>
          <td>${task.assigned}</td>
          <td>${task.hours}</td>
          <td>${task.status}</td>
        </tr>`;
    tasksTableBody.innerHTML += row;
});
}

    async function loadMaterials() {
    const response = await fetch('/api/materials');
    const materials = await response.json();
    const materialsTableBody = document.getElementById('materials_table_body');
    materialsTableBody.innerHTML = '';
    materials.forEach(material => {
    const row = `<tr>
          <td>${material.itemId}</td>
          <td>${material.description}</td>
          <td>${material.quantity}</td>
          <td>${material.employee}</td>
          <td>${material.time}</td>
          <td>${material.date}</td>
        </tr>`;
    materialsTableBody.innerHTML += row;
});
}

    async function loadPlantEquipment() {
    const response = await fetch('/api/plantEquipment');
    const plantEquipments = await response.json();
    const plantEquipmentTableBody = document.getElementById('plant_equipment_table_body');
    plantEquipmentTableBody.innerHTML = '';
    plantEquipments.forEach(plantEquipment => {
    const row = `<tr>
          <td>${plantEquipment.plantEquipment}</td>
          <td>${plantEquipment.hours}</td>
          <td>${plantEquipment.employee}</td>
          <td>${plantEquipment.checkedIn}</td>
          <td>${plantEquipment.checkedOut}</td>
        </tr>`;
    plantEquipmentTableBody.innerHTML += row;
});
}

    async function loadTimeLogs() {
    const response = await fetch('/api/timeLog');
    const timeLogs = await response.json();
    const timeLogTableBody = document.getElementById('time_log_table_body');
    timeLogTableBody.innerHTML = '';
    timeLogs.forEach(timeLog => {
    const row = `<tr>
          <td>${timeLog.employee}</td>
          <td>${timeLog.checkIn}</td>
          <td>${timeLog.checkOut}</td>
          <td>${timeLog.date}</td>
        </tr>`;
    timeLogTableBody.innerHTML += row;
});
}

    async function loadPlans() {
    const response = await fetch('/api/plans');
    const plans = await response.json();
    const plansTableBody = document.getElementById('plans_table_body');
    plansTableBody.innerHTML = '';
    plans.forEach(plan => {
    const row = `<tr>
          <td>${plan.fileName}</td>
          <td>${plan.employee}</td>
          <td>${plan.time}</td>
          <td>${plan.date}</td>
        </tr>`;
    plansTableBody.innerHTML += row;
});
}

    async function loadInvoices() {
    const response = await fetch('/api/invoices');
    const invoices = await response.json();
    const invoicesTableBody = document.getElementById('invoices_table_body');
    invoicesTableBody.innerHTML = '';
    invoices.forEach(invoice => {
    const row = `<tr>
          <td>${invoice.invoiceNumber}</td>
          <td>${invoice.totalAmount}</td>
          <td>${invoice.sent}</td>
          <td>${invoice.status}</td>
        </tr>`;
    invoicesTableBody.innerHTML += row;
});
}

    // Form submission handlers
    document.getElementById('tasks_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData.entries());
    taskData.projectId = 'your_project_id';
    taskData.clientId = 'your_client_id';
    taskData.username = document.getElementById('username').innerText;

    const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(taskData)
});

    if (response.ok) {
    loadTasks();
    event.target.reset();
} else {
    alert('Failed to add task.');
}
});

    document.getElementById('materials_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const materialData = Object.fromEntries(formData.entries());
    materialData.projectId = 'your_project_id';
    materialData.clientId = 'your_client_id';
    materialData.username = document.getElementById('username').innerText;

    const response = await fetch('/api/materials', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(materialData)
});

    if (response.ok) {
    loadMaterials();
    event.target.reset();
} else {
    alert('Failed to add material.');
}
});

    document.getElementById('plant_equipment_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const plantEquipmentData = Object.fromEntries(formData.entries());
    plantEquipmentData.projectId = 'your_project_id';
    plantEquipmentData.clientId = 'your_client_id';
    plantEquipmentData.username = document.getElementById('username').innerText;

    const response = await fetch('/api/plantEquipment', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(plantEquipmentData)
});

    if (response.ok) {
    loadPlantEquipment();
    event.target.reset();
} else {
    alert('Failed to add plant equipment.');
}
});

    document.getElementById('time_log_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const timeLogData = Object.fromEntries(formData.entries());
    timeLogData.projectId = 'your_project_id';
    timeLogData.clientId = 'your_client_id';
    timeLogData.username = document.getElementById('username').innerText;

    const response = await fetch('/api/timeLog', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(timeLogData)
});

    if (response.ok) {
    loadTimeLogs();
    event.target.reset();
} else {
    alert('Failed to add time log.');
}
});

    document.getElementById('upload_plans_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const planData = Object.fromEntries(formData.entries());
    planData.projectId = 'your_project_id';
    planData.clientId = 'your_client_id';
    planData.username = document.getElementById('username').innerText;

    const response = await fetch('/api/plans', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(planData)
});

    if (response.ok) {
    loadPlans();
    event.target.reset();
} else {
    alert('Failed to upload plan.');
}
});

    document.getElementById('invoices_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const invoiceData = Object.fromEntries(formData.entries());
    invoiceData.projectId = 'your_project_id';
    invoiceData.clientId = 'your_client_id';
    invoiceData.username = document.getElementById('username').innerText;

    const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(invoiceData)
});

    if (response.ok) {
    loadInvoices();
    event.target.reset();
} else {
    alert('Failed to add invoice.');
}
});

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

    function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
    tab.classList.remove('active');
});
    document.getElementById(tabId).classList.add('active');
}
