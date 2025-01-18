document.addEventListener('DOMContentLoaded', () => {
    const username = document.getElementById('username').innerText;

    // Helper function to submit form data
    const submitForm = async (url, formData, loadFunction, formElement) => {
        formData.projectId = 'your_project_id'; // Replace with actual project ID
        formData.clientId = 'your_client_id'; // Replace with actual client ID
        formData.username = username;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to submit form');

            loadFunction();
            formElement.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    // Form submission handlers
    document.getElementById('tasks_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        submitForm('/api/projects_card_tabs/tasks', formData, loadTasks, event.target);
    });

    document.getElementById('materials_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        submitForm('/api/projects_card_tabs/materials', formData, loadMaterials, event.target);
    });

    document.getElementById('plant_equipment_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        submitForm('/api/projects_card_tabs/plantEquipment', formData, loadPlantEquipment, event.target);
    });

    document.getElementById('time_log_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        submitForm('/api/projects_card_tabs/timeLog', formData, loadTimeLogs, event.target);
    });

    document.getElementById('upload_plans_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        submitForm('/api/projects_card_tabs/plans', formData, loadPlans, event.target);
    });

    document.getElementById('invoices_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        submitForm('/api/projects_card_tabs/invoices', formData, loadInvoices, event.target);
    });
});