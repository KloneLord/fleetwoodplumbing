document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabId = urlParams.get('tab') || 'day_schedule_tab'; // Default tab
    showTab(tabId);
    await fetchSession()
    updateDisplayDate();
    updateDisplayWeek();
    updateDisplayMonth();
    await fetchScheduleData();
});

let currentDate = new Date();

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

    // Load projects and employees when clicking Submit Entry tab
    if (tabId === 'submit_entry_tab') {
        populateProjectDropdown(); // Load projects
        populateWorkerDropdown(); // Load employees
        setDefaultTimes(); // Set default start & end times
    }

    fetchScheduleData();
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


async function fetchScheduleData() {
    try {
        const response = await fetch('/api/schedule/list');
        if (response.ok) {
            const scheduleData = await response.json();
            const activeTab = document.querySelector('.tab.active').id;

            if (activeTab === 'day_schedule_tab') {
                populateDailySchedule(scheduleData);
            } else if (activeTab === 'week_schedule_tab') {
                populateWeeklySchedule(scheduleData);
            } else if (activeTab === 'full_schedule_tab') {
                populateMonthlySchedule(scheduleData);
            }
        } else {
            console.error('Failed to fetch schedule data');
        }
    } catch (error) {
        console.error('Error fetching schedule data:', error);
    }
}

function updateDisplayDate() {
    document.getElementById('displayDate').innerText = formatDate(currentDate);
}

function updateDisplayWeek() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Adjust to start of the week (Monday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // End of the week (Sunday)
    document.getElementById('displayWeek').innerText = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
}

function updateDisplayMonth() {
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    document.getElementById('displayMonth').innerText = `${month} ${year}`;
}

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDisplayDate();
    fetchScheduleData();
}

function changeWeek(weeks) {
    currentDate.setDate(currentDate.getDate() + weeks * 7);
    updateDisplayWeek();
    fetchScheduleData();
}

function changeMonth(months) {
    currentDate.setMonth(currentDate.getMonth() + months);
    updateDisplayMonth();
    fetchScheduleData();
}

// Format date as DD/MM/YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Daily schedule population
function populateDailySchedule(scheduleData) {
    const scheduleBody = document.getElementById('schedule_body');
    scheduleBody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        for (let i = 6 * 4; i < 18 * 4; i++) { // From 06:00 to 18:00
            const cell = document.createElement('td');
            cell.dataset.employee = employee;
            cell.dataset.time = i;

            const job = scheduleData.find(entry =>
                entry.employee === employee &&
                isSameDay(new Date(entry.date), currentDate) &&
                isTimeInRange(i, entry.start_time, entry.finish_time)
            );

            if (job) {
                cell.style.backgroundColor = '#3498db';
                cell.title = job.job;
            }

            row.appendChild(cell);
        }
        scheduleBody.appendChild(row);
    });
}

// Helper function to determine if a time falls within a slot
function isTimeInSlot(slot, startTime, finishTime) {
    const startSlot = timeToSlot(startTime);
    const endSlot = timeToSlot(finishTime);
    return slot >= startSlot && slot < endSlot;
}

// Convert time to 15-minute slot index
function timeToSlot(time) {
    const [hour, minute] = time.split(':').map(Number);
    return (hour - 6) * 4 + Math.floor(minute / 15); // 6 AM corresponds to slot 0
}

function populateWeeklySchedule(scheduleData) {
    const weekBody = document.getElementById('weekly_schedule_body');
    weekBody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');

        for (let day = 0; day < 7; day++) {
            for (let slot = 0; slot < 48; slot++) { // 48 slots per day
                const cell = document.createElement('td');
                cell.dataset.employee = employee;
                cell.dataset.day = day;
                cell.dataset.slot = slot;

                const job = scheduleData.find(entry =>
                    entry.employee === employee &&
                    isSameDay(new Date(entry.date), new Date()) && // Adjust for correct day logic
                    isTimeInSlot(slot, entry.start_time, entry.finish_time)
                );

                if (job) {
                    cell.style.backgroundColor = '#3498db';
                    cell.title = job.job;
                }

                row.appendChild(cell);
            }
        }

        weekBody.appendChild(row);
    });
}


// Check if a job overlaps with a time range
function isTimeInRange(slot, startTime, finishTime) {
    const startSlot = timeToSlot(startTime);
    const endSlot = timeToSlot(finishTime);
    return slot >= startSlot && slot < endSlot;
}



// Check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

// Function to open modal for adding/editing a schedule entry
function openModal(cell) {
    const employee = cell.getAttribute('data-employee');
    const timeSlot = parseInt(cell.getAttribute('data-time'), 10);
    const startHour = timeSlot * 6 + 6;

    const modal = document.getElementById('myModal');
    document.getElementById('modalEmployee').value = employee;
    document.getElementById('modalStartTime').value = `${String(startHour).padStart(2, '0')}:00`;
    document.getElementById('modalDate').value = formatDate(currentDate);

    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    document.getElementById('myModal').style.display = "none";
    document.getElementById('statusMessage').innerText = ''; // Clear status message
}

// Handle form submission for adding/editing job
document.getElementById('modalForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/schedule/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            document.getElementById('statusMessage').innerText = 'Schedule log saved successfully';
            document.getElementById('statusMessage').classList.remove('error');
            await fetchScheduleData(); // Refresh the schedule data
        } else {
            const errorData = await response.json();
            document.getElementById('statusMessage').innerText = `Failed to save schedule log: ${errorData.error}`;
            document.getElementById('statusMessage').classList.add('error');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('statusMessage').innerText = 'An error occurred while saving the schedule log';
        document.getElementById('statusMessage').classList.add('error');
    }
});


function openClockModal(scheduleEntry) {
    const modal = document.getElementById('clockModal');
    const modalTitle = document.getElementById('clockModalTitle');

    modalTitle.innerText = `${scheduleEntry.employee} - ${scheduleEntry.job}`;
    modal.style.display = 'block';

    // Add functionality for clock-in and clock-out buttons
    document.querySelector('#clockModal button[onclick="clockOn()"]').onclick = () => {
        alert(`Clocked ON for ${scheduleEntry.job}`);
        modal.style.display = 'none';
    };

    document.querySelector('#clockModal button[onclick="clockOff()"]').onclick = () => {
        alert(`Clocked OFF for ${scheduleEntry.job}`);
        modal.style.display = 'none';
    };
}

// Function to close clock modal
function closeClockModal() {
    document.getElementById('clockModal').style.display = "none";
}

// Function to clock on
function clockOn() {
    alert('Clock On functionality');
}

// Function to clock off
function clockOff() {
    alert('Clock Off functionality');
}

// Function to update color preview
function updateColorBox() {
    const selectedColor = document.getElementById('color_select').value;
    document.getElementById('color_preview').style.backgroundColor = selectedColor;
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', fetchProjects);

// Function to populate color options
function updateColorOptions() {
    const colorSelect = document.getElementById("color_select");
    colorSelect.innerHTML = "";
    for (const [name, code] of Object.entries(colors)) {
        const option = document.createElement("option");
        option.value = code;
        option.innerHTML = `${name}`;
        option.style.backgroundColor = "white";
        option.style.color = "black";
        option.style.paddingLeft = "5px";
        option.style.display = "flex";
        option.style.alignItems = "center";
        option.style.justifyContent = "start";
        const colorBox = document.createElement("span");
        colorBox.style.display = "inline-block";
        colorBox.style.width = "15px";
        colorBox.style.height = "15px";
        colorBox.style.backgroundColor = code;
        colorBox.style.border = "1px solid #000";
        colorBox.style.marginRight = "5px";
        option.prepend(colorBox);
        colorSelect.appendChild(option);
    }
}

async function fetchEmployeesAndPopulateSchedule() {
    try {
        const response = await fetch('/api/employees/all'); // Fetch from the `/all` route
        if (response.ok) {
            const employees = await response.json();
            populateEmployeeColumn(employees);
        } else {
            console.error('Failed to fetch employees:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

function populateEmployeeColumn(employees) {
    const fixedColumnBody = document.getElementById('fixed_column_body');
    const scheduleBody = document.getElementById('schedule_body');

    fixedColumnBody.innerHTML = ''; // Clear existing content
    scheduleBody.innerHTML = '';

    employees.forEach(employee => {
        // Employee column
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.className = 'employee-name';
        cell.innerHTML = `${employee.first_name} ${employee.last_name} <span style="color: white;">${employee.schedule_color}</span>`;
        row.appendChild(cell);
        fixedColumnBody.appendChild(row);

        // Schedule row
        const scheduleRow = document.createElement('tr');
        for (let i = 6 * 4; i < 18 * 4; i++) {
            const cell = document.createElement('td');
            cell.dataset.employee = employee.user_id;
            cell.dataset.time = i;
            cell.style.backgroundColor = employee.schedule_color; // Apply color
            scheduleRow.appendChild(cell);
        }
        scheduleBody.appendChild(scheduleRow);
    });
}

// Call function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', fetchEmployeesAndPopulateSchedule);



// Load employees on page load
document.addEventListener('DOMContentLoaded', async () => {
    await fetchEmployees();
});

document.getElementById('color_assignments_form').addEventListener('submit', async function (event) {
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
            fetchEmployeesAndPopulateSchedule(); // Refresh schedule with new colors
        } else {
            const errorData = await response.json();
            alert(`Failed to update employee color: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error updating employee color:', error);
    }
});


// Handle color assignments form submission
document.getElementById('color_assignments_form').addEventListener('submit', function(event) {
    event.preventDefault();
    const employee = document.getElementById('employee_select').value;
    const color = document.getElementById('color_select').value;

    // Save color assignment logic here (e.g., save to local storage, database, etc.)
    console.log(`Assigned ${color} to ${employee}`);
    alert(`Color ${color} assigned to ${employee}`);
});

document.getElementById('work_days_form').addEventListener('submit', async function (event) {
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
document.getElementById('color_assignments_form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const user_id = document.getElementById('employee_select').value;
    const schedule_color = document.getElementById('color_select').value;

    try {
        const response = await fetch(`/api/employees/update-color/${user_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ schedule_color }),
        });

        if (response.ok) {
            alert(`Color updated successfully for employee ID: ${user_id}`);
            fetchEmployeesAndPopulateSchedule(); // Refresh schedule display
        } else {
            alert('Failed to update color');
        }
    } catch (error) {
        console.error('Error updating employee color:', error);
    }
});
async function fetchEmployeesForColorAssignment() {
    try {
        const response = await fetch('/api/employees/all'); // Fetch employees
        if (response.ok) {
            const employees = await response.json();
            const employeeSelect = document.getElementById('employee_select');

            employeeSelect.innerHTML = ''; // Clear existing options

            employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.user_id;
                option.textContent = `${employee.first_name} ${employee.last_name}`;
                employeeSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch employees:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}


document.addEventListener('DOMContentLoaded', fetchEmployeesForColorAssignment);

document.addEventListener('DOMContentLoaded', fetchProjects);


async function fetchProjects() {
    try {
        const response = await fetch('/api/projects/list'); // Ensure this route exists
        if (response.ok) {
            const projects = await response.json();
            const projectSelect = document.getElementById('project_select');
            projectSelect.innerHTML = ''; // Clear existing options

            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project._id; // Ensure it uses the correct field (_id)
                option.textContent = project.project_name || project.name; // Ensure correct field is used
                projectSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch projects:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

async function fetchEmployeesForSubmitEntry() {
    try {
        const response = await fetch('/api/employees/all');
        if (response.ok) {
            const employees = await response.json();
            console.log("Employees fetched for Submit Entry:", employees); // Debugging

            const workerSelect = document.getElementById('worker_select');
            workerSelect.innerHTML = ''; // Clear existing options

            employees.forEach(employee => {
                console.log("Processing employee:", employee); // Debugging

                const option = document.createElement('option');
                option.value = employee.user_id; // Ensure this matches your DB field
                option.textContent = `${employee.first_name} ${employee.last_name}`;
                workerSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch employees for Submit Entry:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching employees for Submit Entry:', error);
    }
}

// Ensure the function runs when the Submit Entry tab is opened
document.addEventListener('DOMContentLoaded', () => {
    const submitEntryTab = document.getElementById('submit_entry_tab');
    if (submitEntryTab) {
        fetchEmployeesForSubmitEntry();
    }
});


async function populateProjectDropdown() {
    try {
        const response = await fetch('/api/projects/list');
        if (!response.ok) throw new Error('Failed to fetch projects.');

        const projects = await response.json();

        // Select both dropdown elements
        const dashboardProjectSelect = document.getElementById('project_select');
        const submitProjectSelect = document.getElementById('submit_project_select');

        if (dashboardProjectSelect) {
            dashboardProjectSelect.innerHTML = ''; // Clear existing options
        }
        if (submitProjectSelect) {
            submitProjectSelect.innerHTML = ''; // Clear existing options
        }

        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.projectID;
            option.textContent = `${project.customer} - ${project.title}`;

            // Append option to both dropdowns if they exist
            if (dashboardProjectSelect) {
                dashboardProjectSelect.appendChild(option.cloneNode(true));
            }
            if (submitProjectSelect) {
                submitProjectSelect.appendChild(option.cloneNode(true));
            }
        });

    } catch (error) {
        console.error('Error fetching project data:', error);
    }
}

// Ensure dropdowns are populated when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateProjectDropdown();
});


function setDefaultTimes() {
    const now = new Date();

    // Format date as YYYY-MM-DD
    const formattedDate = now.toISOString().split('T')[0];

    // Set start time to 07:00 AM
    const startTime = `${formattedDate}T07:00`;

    // Set end time to 04:30 PM
    const endTime = `${formattedDate}T16:30`;

    // Get the start and end time input fields
    document.getElementById('start_time').value = startTime;
    document.getElementById('end_time').value = endTime;
}
async function fetchAndPopulateProjects() {
    try {
        const response = await fetch('/api/projects/list');
        if (!response.ok) {
            console.error('Failed to fetch projects:', response.status, response.statusText);
            return;
        }

        const projects = await response.json();
        console.log('Projects fetched:', projects); // Debugging

        const projectSelect = document.getElementById('project_select');

        // Clear existing options and add a placeholder
        projectSelect.innerHTML = '<option value="">Select a Project</option>';

        // Populate the dropdown
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.projectID; // Use `projectID` as the value
            option.textContent = project.title; // Use `title` as the display text
            projectSelect.appendChild(option);
        });

        console.log('Projects loaded into dropdown');
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

async function submitScheduleLog(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const scheduleLog = {
        user_id: document.getElementById('user_id')?.value || null,
        employee: document.getElementById('worker_select')?.value || null,
        project_id: document.getElementById('submit_project_select')?.value || null,
        project_title: document.getElementById('submit_project_select')?.options[document.getElementById('submit_project_select').selectedIndex]?.text || null,
        start_time: document.getElementById('start_time')?.value || null,
        finish_time: document.getElementById('end_time')?.value || null,
        schedule_job_description: document.getElementById('task_description')?.value || null
    };

    // **Debugging Logs**
    console.log('Submitting Schedule Log:', scheduleLog);

    // Check if any required field is missing
    for (const key in scheduleLog) {
        if (scheduleLog[key] === null || scheduleLog[key] === '') {
            console.error(`Missing value for: ${key}`);
        }
    }

    try {
        const response = await fetch('/api/schedule/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleLog)
        });

        const result = await response.json();

        console.log('Server Response:', result);

        if (!response.ok) {
            throw new Error(`Server Error: ${result.message}`);
        }

        alert('Schedule Log Submitted Successfully!');
        document.getElementById('submit_entry_form').reset(); // Reset form

    } catch (error) {
        console.error('Error submitting schedule log:', error);
        alert('Failed to submit schedule log. Check console for details.');
    }
}

// Attach function to form submission
document.getElementById('submit_entry_form').addEventListener('submit', submitScheduleLog);


// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndPopulateProjects);


// Call this function when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects);
document.addEventListener('DOMContentLoaded', populateProjectDropdown);
document.addEventListener('DOMContentLoaded', setDefaultTimes);
