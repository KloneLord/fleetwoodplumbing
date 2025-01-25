let equipmentData = [];
let currentPage = 1;
const itemsPerPage = 10;

async function generateAuthCode(requestSource = 'equipment') {
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


// Initialize the form with generated ID and current date
async function initializeAddEquipmentForm() {
    document.getElementById('machineId').value = await generateAuthCode();
}


// Fetch equipment data from the server
async function fetchEquipmentData() {
    try {
        const response = await fetch('/api/plant-equipment/list');
        if (!response.ok) {
            throw new Error('Failed to fetch equipment data.');
        }
        equipmentData = await response.json();
        renderEquipmentTable();
    } catch (error) {
        console.error('Error fetching equipment data:', error);
    }
}

// Populate service dropdown with equipment names
function populateServiceDropdown(equipmentNames) {
    const serviceDropdown = document.getElementById('serviceMachineId');

    if (!serviceDropdown) {
        console.error('Service dropdown element not found');
        return;
    }

    serviceDropdown.innerHTML = '';

    equipmentNames.forEach(equipment => {
        const option = document.createElement('option');
        option.value = equipment.machineId;
        option.text = equipment.machineName;
        serviceDropdown.add(option);
    });

    console.log('Service dropdown:', serviceDropdown.innerHTML);
}

// Populate repair dropdown with equipment names
function populateRepairDropdown(equipmentNames) {
    const repairDropdown = document.getElementById('repairMachineId');

    if (!repairDropdown) {
        console.error('Repair dropdown element not found');
        return;
    }

    repairDropdown.innerHTML = '';

    equipmentNames.forEach(equipment => {
        const option = document.createElement('option');
        option.value = equipment.machineId;
        option.text = equipment.machineName;
        repairDropdown.add(option);
    });

    console.log('Repair dropdown:', repairDropdown.innerHTML);
}

// Fetch equipment names for dropdowns
async function fetchEquipmentNames() {
    try {
        const response = await fetch('/api/plant-equipment/names');
        if (!response.ok) {
            throw new Error('Failed to fetch equipment names.');
        }
        const equipmentNames = await response.json();
        console.log('Fetched equipment names:', equipmentNames);
        populateServiceDropdown(equipmentNames);
        populateRepairDropdown(equipmentNames);
    } catch (error) {
        console.error('Error fetching equipment names:', error);
    }
}

// Render equipment table
function renderEquipmentTable() {
    const equipmentTableBody = document.getElementById('equipmentTable').querySelector('tbody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = equipmentData.slice(start, end);

    let rows = '';
    paginatedData.forEach(equipment => {
        rows += `<tr>
            <td>${equipment.machineId}</td>
            <td>${equipment.machineName}</td>
            <td>${equipment.yearOfManufacture}</td>
            <td>${equipment.currentHours}</td>
            <td>${new Date(equipment.nextServiceDate).toLocaleDateString()}</td>
            <td>
                <button onclick="editEquipment('${equipment.machineId}')">Edit</button>
                <button onclick="deleteEquipment('${equipment.machineId}')">Delete</button>
            </td>
        </tr>`;
    });

    equipmentTableBody.innerHTML = rows || '<tr><td colspan="6">No equipment found.</td></tr>';
    updatePaginationControls();
}

// Update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
    document.getElementById('currentPage').innerText = currentPage;
    document.getElementById('totalPages').innerText = totalPages;

    document.querySelector('.pagination button[onclick="prevPage()"]').disabled = currentPage === 1;
    document.querySelector('.pagination button[onclick="nextPage()"]').disabled = currentPage === totalPages;
}

// Pagination functions
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderEquipmentTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderEquipmentTable();
    }
}

// Filter equipment based on search input
function filterEquipment() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const filteredData = equipmentData.filter(equipment =>
        equipment.machineId.toLowerCase().includes(searchTerm) ||
        equipment.machineName.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    equipmentData = filteredData;
    renderEquipmentTable();
}

// Sort equipment based on selected option
function sortEquipment() {
    const sortOption = document.getElementById('sortSelect').value;
    equipmentData.sort((a, b) => {
        switch (sortOption) {
            case 'id_asc': return a.machineId.localeCompare(b.machineId);
            case 'id_desc': return b.machineId.localeCompare(a.machineId);
            case 'name_asc': return a.machineName.localeCompare(b.machineName);
            case 'name_desc': return b.machineName.localeCompare(a.machineName);
            default: return 0;
        }
    });
    renderEquipmentTable();
}

// Open modal to edit equipment
function editEquipment(machineId) {
    const equipment = equipmentData.find(eq => eq.machineId === machineId);
    if (!equipment) return;

    document.getElementById('editMachineId').value = equipment.machineId;
    document.getElementById('editMachineName').value = equipment.machineName;
    document.getElementById('editYearOfManufacture').value = equipment.yearOfManufacture;
    document.getElementById('editCurrentHours').value = equipment.currentHours;
    document.getElementById('editNextServiceDate').value = new Date(equipment.nextServiceDate).toISOString().split('T')[0];

    document.getElementById('editModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle form submissions for editing equipment
document.getElementById('editEquipmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/plant-equipment/equipment/${updatedData.machineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update equipment.');
        }

        alert('Equipment updated successfully!');
        closeModal();
        fetchEquipmentData();
    } catch (error) {
        console.error('Error updating equipment:', error);
    }
});

// Handle form submissions for adding equipment
document.getElementById('addEquipmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const equipmentData = Object.fromEntries(formData.entries());

    // Ensure attachments field is an array of strings
    if (formData.getAll('attachments').length > 0) {
        equipmentData.attachments = formData.getAll('attachments').map(file => file.name);
    } else {
        equipmentData.attachments = [];
    }

    try {
        const response = await fetch('/api/plant-equipment/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipmentData),
        });

        if (!response.ok) {
            throw new Error('Failed to add equipment.');
        }

        alert('Equipment added successfully!');
        e.target.reset();
        initializeAddEquipmentForm();
        fetchEquipmentData();
        fetchEquipmentNames();
    } catch (error) {
        console.error('Error adding equipment:', error);
    }
});

// Handle form submissions for scheduling service
document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const serviceData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/plant-equipment/service', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            throw new Error('Failed to schedule service.');
        }

        alert('Service scheduled successfully!');
        e.target.reset();
        fetchServiceData();
    } catch (error) {
        console.error('Error scheduling service:', error);
    }
});

// Handle form submissions for logging repair
document.getElementById('repairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const repairData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/plant-equipment/repair', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repairData),
        });

        if (!response.ok) {
            throw new Error('Failed to log repair.');
        }

        alert('Repair logged successfully!');
        e.target.reset();
        fetchRepairData();
    } catch (error) {
        console.error('Error logging repair:', error);
    }
});

// Function to delete equipment
async function deleteEquipment(machineId) {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
        const response = await fetch(`/api/plant-equipment/equipment/${machineId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete equipment.');
        }

        alert('Equipment deleted successfully!');
        fetchEquipmentData();
    } catch (error) {
        console.error('Error deleting equipment:', error);
    }
}

// Function to log out
function logOut() {
    alert('You have been logged out successfully!');
    window.location.href = 'portal_login.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchEquipmentData();
    fetchEquipmentNames();
    showTab('equipment_list_tab');
    initializeAddEquipmentForm();
});

// Fetch service data from the server
async function fetchServiceData() {
    try {
        const response = await fetch('/api/plant-equipment/services');
        if (!response.ok) {
            throw new Error('Failed to fetch service data.');
        }
        const serviceData = await response.json();
        renderServiceTable(serviceData);
    } catch (error) {
        console.error('Error fetching service data:', error);
    }
}


// Fetch repair data from the server
async function fetchRepairData() {
    try {
        const response = await fetch('/api/plant-equipment/repairs');
        if (!response.ok) {
            throw new Error('Failed to fetch repair data.');
        }
        const repairData = await response.json();
        renderRepairTable(repairData);
    } catch (error) {
        console.error('Error fetching repair data:', error);
    }
}


// Function to delete service
async function deleteService(machineId) {
    if (!confirm('Are you sure you want to delete this service record?')) return;

    try {
        const response = await fetch(`/api/plant-equipment/service/${machineId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete service record.');
        }

        alert('Service record deleted successfully!');
        fetchServiceData();
    } catch (error) {
        console.error('Error deleting service record:', error);
    }
}

// Function to delete repair
async function deleteRepair(machineId) {
    if (!confirm('Are you sure you want to delete this repair record?')) return;

    try {
        const response = await fetch(`/api/plant-equipment/repair/${machineId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete repair record.');
        }

        alert('Repair record deleted successfully!');
        fetchRepairData();
    } catch (error) {
        console.error('Error deleting repair record:', error);
    }
}

// Open modal to edit service
function editService(machineId) {
    const service = serviceData.find(svc => svc.machineId === machineId);
    if (!service) return;

    document.getElementById('editMachineId').value = service.machineId;
    document.getElementById('editServiceDate').value = new Date(service.serviceDate).toISOString().split('T')[0];
    document.getElementById('editServiceDetails').value = service.serviceDetails;
    document.getElementById('editServiceTechnician').value = service.serviceTechnician;

    document.getElementById('editModal').style.display = 'block';
}

// Open modal to edit repair
function editRepair(machineId) {
    const repair = repairData.find(rpr => rpr.machineId === machineId);
    if (!repair) return;

    document.getElementById('editMachineId').value = repair.machineId;
    document.getElementById('editRepairDate').value = new Date(repair.repairDate).toISOString().split('T')[0];
    document.getElementById('editRepairDetails').value = repair.repairDetails;
    document.getElementById('editRepairCost').value = repair.repairCost;

    document.getElementById('editModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle form submissions for editing service
document.getElementById('editServiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/plant-equipment/service/${updatedData.machineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update service.');
        }

        alert('Service updated successfully!');
        closeModal();
        fetchServiceData();
    } catch (error) {
        console.error('Error updating service:', error);
    }
});

// Handle form submissions for editing repair
document.getElementById('editRepairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/plant-equipment/repair/${updatedData.machineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update repair.');
        }

        alert('Repair updated successfully!');
        closeModal();
        fetchRepairData();
    } catch (error) {
        console.error('Error updating repair:', error);
    }
});



let serviceData = [];
let repairData = [];

// Function to close the service modal
function closeServiceModal() {
    document.getElementById('editServiceModal').style.display = 'none';
}

// Function to close the repair modal
function closeRepairModal() {
    document.getElementById('editRepairModal').style.display = 'none';
}

// Open modal to edit service
function editService(machineId) {
    const service = serviceData.find(svc => svc.machineId === machineId);
    if (!service) return;

    document.getElementById('editServiceMachineId').value = service.machineId;
    document.getElementById('editServiceDate').value = new Date(service.serviceDate).toISOString().split('T')[0];
    document.getElementById('editServiceDetails').value = service.serviceDetails;
    document.getElementById('editServiceTechnician').value = service.serviceTechnician;

    document.getElementById('editServiceModal').style.display = 'block';
}

// Open modal to edit repair
function editRepair(machineId) {
    const repair = repairData.find(rpr => rpr.machineId === machineId);
    if (!repair) return;

    document.getElementById('editRepairMachineId').value = repair.machineId;
    document.getElementById('editRepairDate').value = new Date(repair.repairDate).toISOString().split('T')[0];
    document.getElementById('editRepairDetails').value = repair.repairDetails;
    document.getElementById('editRepairCost').value = repair.repairCost;

    document.getElementById('editRepairModal').style.display = 'block';
}

// Handle form submissions for editing service
document.getElementById('editServiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/plant-equipment/service/${updatedData.machineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update service.');
        }

        alert('Service updated successfully!');
        closeServiceModal();
        fetchServiceData();
    } catch (error) {
        console.error('Error updating service:', error);
    }
});

// Handle form submissions for editing repair
document.getElementById('editRepairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/api/plant-equipment/repair/${updatedData.machineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update repair.');
        }

        alert('Repair updated successfully!');
        closeRepairModal();
        fetchRepairData();
    } catch (error) {
        console.error('Error updating repair:', error);
    }
});

// Render service table
function renderServiceTable(serviceData) {
    const serviceTableBody = document.getElementById('serviceHistoryBody');
    serviceTableBody.innerHTML = '';

    if (serviceData.length === 0) {
        serviceTableBody.innerHTML = '<tr><td colspan="5">No service records found.</td></tr>';
        return;
    }

    serviceData.forEach(service => {
        const row = `<tr>
            <td>${service.machineId}</td>
            <td>${new Date(service.serviceDate).toLocaleDateString()}</td>
            <td>${service.serviceDetails}</td>
            <td>${service.serviceTechnician}</td>
            <td>
                <button onclick="editService('${service.machineId}')">Edit</button>
                <button onclick="deleteService('${service.machineId}')">Delete</button>
            </td>
        </tr>`;
        serviceTableBody.innerHTML += row;
    });
}

// Render repair table
function renderRepairTable(repairData) {
    const repairTableBody = document.getElementById('repairHistoryBody');
    repairTableBody.innerHTML = '';

    if (repairData.length === 0) {
        repairTableBody.innerHTML = '<tr><td colspan="5">No repair records found.</td></tr>';
        return;
    }

    repairData.forEach(repair => {
        const row = `<tr>
            <td>${repair.machineId}</td>
            <td>${new Date(repair.repairDate).toLocaleDateString()}</td>
            <td>${repair.repairDetails}</td>
            <td>${repair.repairCost}</td>
            <td>
                <button onclick="editRepair('${repair.machineId}')">Edit</button>
                <button onclick="deleteRepair('${repair.machineId}')">Delete</button>
            </td>
        </tr>`;
        repairTableBody.innerHTML += row;
    });
}