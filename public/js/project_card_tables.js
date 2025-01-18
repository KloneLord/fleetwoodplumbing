document.addEventListener('DOMContentLoaded', async () => {
    const username = document.getElementById('username').innerText;

    // Helper function to load data into a table
    const loadTableData = async (url, tableBodyId, createRow) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const tableBody = document.getElementById(tableBodyId);
            tableBody.innerHTML = '';
            data.forEach((item) => {
                const row = createRow(item);
                tableBody.innerHTML += row;
            });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    // Load functions for each table
    const loadTasks = () => {
        loadTableData('/api/projects_card_tabs/tasks', 'tasks_table_body', (task) => `
      <tr>
        <td>${task.task}</td>
        <td>${task.details}</td>
        <td>${task.assigned}</td>
        <td>${task.hours}</td>
        <td>${task.status}</td>
      </tr>
    `);
    };

    const loadMaterials = () => {
        loadTableData('/api/projects_card_tabs/materials', 'materials_table_body', (material) => `
      <tr>
        <td>${material.itemId}</td>
        <td>${material.description}</td>
        <td>${material.quantity}</td>
        <td>${material.employee}</td>
        <td>${material.time}</td>
        <td>${material.date}</td>
      </tr>
    `);
    };

    const loadPlantEquipment = () => {
        loadTableData('/api/projects_card_tabs/plantEquipment', 'plant_equipment_table_body', (plantEquipment) => `
      <tr>
        <td>${plantEquipment.plantEquipment}</td>
        <td>${plantEquipment.hours}</td>
        <td>${plantEquipment.employee}</td>
        <td>${plantEquipment.checkedIn}</td>
        <td>${plantEquipment.checkedOut}</td>
      </tr>
    `);
    };

    const loadTimeLogs = () => {
        loadTableData('/api/projects_card_tabs/timeLog', 'time_log_table_body', (timeLog) => `
      <tr>
        <td>${timeLog.employee}</td>
        <td>${timeLog.checkIn}</td>
        <td>${timeLog.checkOut}</td>
        <td>${timeLog.date}</td>
      </tr>
    `);
    };

    const loadPlans = () => {
        loadTableData('/api/projects_card_tabs/plans', 'plans_table_body', (plan) => `
      <tr>
        <td>${plan.fileName}</td>
        <td>${plan.employee}</td>
        <td>${plan.time}</td>
        <td>${plan.date}</td>
      </tr>
    `);
    };

    const loadInvoices = () => {
        loadTableData('/api/projects_card_tabs/invoices', 'invoices_table_body', (invoice) => `
      <tr>
        <td>${invoice.invoiceNumber}</td>
        <td>${invoice.totalAmount}</td>
        <td>${invoice.sent}</td>
        <td>${invoice.status}</td>
      </tr>
    `);
    };

    // Initial load of data into tables
    loadTasks();
    loadMaterials();
    loadPlantEquipment();
    loadTimeLogs();
    loadPlans();
    loadInvoices();
});