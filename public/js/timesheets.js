document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabId = urlParams.get('tab') || 'timesheet_display'; // Default tab
    showTab(tabId);

    // Auto-fill the timesheet entry form with the current date and default times
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('entry_date').value = currentDate;
    document.getElementById('start_time').value = '08:00';
    document.getElementById('end_time').value = '16:30';

    // Load employee list
    loadEmployeeList();

    // Generate work days form
    generateWorkDaysForm();

    // Load employees for color assignments
    loadEmployeesForColorAssignments();
});

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
    buttons.forEach(button => button.classList.remove('active'));

    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function loadEmployeeList() {
    fetch('/api/employees/all')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('employee_table_body');
            tableBody.innerHTML = ''; // Clear existing table data

            data.forEach(employee => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = employee.user_id;
                row.appendChild(idCell);

                const firstNameCell = document.createElement('td');
                firstNameCell.textContent = employee.first_name;
                row.appendChild(firstNameCell);

                const lastNameCell = document.createElement('td');
                lastNameCell.textContent = employee.last_name;
                row.appendChild(lastNameCell);

                const roleCell = document.createElement('td');
                roleCell.textContent = employee.role;
                row.appendChild(roleCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading employee list:', error);
            alert('An error occurred while loading the employee list. Please try again.');
        });
}

function generateWorkDaysForm() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const workDaysDiv = document.getElementById('work_days');
    days.forEach((day, index) => {
        const isChecked = index < 5 ? 'checked' : '';
        const defaultStartTime = '08:00';
        const defaultEndTime = '16:30';

        const dayDiv = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = day.toLowerCase();
        checkbox.name = 'work_days';
        checkbox.value = day;
        if (isChecked) checkbox.checked = true;
        dayDiv.appendChild(checkbox);

        const label = document.createElement('label');
        label.htmlFor = day.toLowerCase();
        label.textContent = day;
        dayDiv.appendChild(label);

        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'time';
        startTimeInput.name = `${day.toLowerCase()}_start`;
        startTimeInput.value = defaultStartTime;
        dayDiv.appendChild(startTimeInput);

        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'time';
        endTimeInput.name = `${day.toLowerCase()}_end`;
        endTimeInput.value = defaultEndTime;
        dayDiv.appendChild(endTimeInput);

        workDaysDiv.appendChild(dayDiv);
    });
}

function loadEmployeesForColorAssignments() {
    fetch('/api/employees/all')
        .then(response => response.json())
        .then(data => {
            const employeeSelect = document.getElementById('employee_select');
            employeeSelect.innerHTML = ''; // Clear existing options

            data.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.user_id;
                option.textContent = `${employee.first_name} ${employee.last_name}`;
                employeeSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading employees for color assignment:', error));
}

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

function updateColorBox() {
    const colorSelect = document.getElementById('color_select');
    const colorPreview = document.getElementById('color_preview');
    colorPreview.style.backgroundColor = colorSelect.value;
}

document.getElementById('color_assignments_form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const user_id = document.getElementById('employee_select').value;
    const schedule_color = document.getElementById('color_select').value;

    try {
        const response = await fetch('/api/employees/update-color', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, schedule_color }),
        });

        if (response.ok) {
            alert('Employee color updated successfully!');
            loadEmployeesForColorAssignments(); // Refresh employee list with new colors
        } else {
            const errorData = await response.json();
            alert(`Failed to update employee color: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error updating employee color:', error);
    }
});

document.getElementById('work_days_form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const workHours = {};
    const stateSelect = document.getElementById('state_select').value;

    document.querySelectorAll('#work_days input[type="time"]').forEach(input => {
        workHours[input.name] = input.value;
    });

    const data = {
        publicholiday_state: stateSelect,
        work_hours: workHours
    };

    try {
        const response = await fetch('/api/business_times/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Business times saved successfully!');
        } else {
            const errorData = await response.json();
            alert(`Failed to save business times: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error saving business times:', error);
    }
});