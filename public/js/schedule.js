import { fetchJobs, clockInOutJob } from './schedule_routes.js';

document.addEventListener('DOMContentLoaded', async () => {
    const scheduler = document.getElementById('scheduler');
    const modal = document.getElementById('job-modal');
    const jobDetails = document.getElementById('job-details');
    const clockInOutBtn = document.getElementById('clock-in-out');

    // Fetch and display jobs
    const jobs = await fetchJobs();
    jobs.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'p-2 bg-blue-100 rounded shadow cursor-pointer';
        jobDiv.innerHTML = `<strong>${job.project_title}</strong><br>${job.job_site}<br>${job.first_name} ${job.last_name}`;
        jobDiv.dataset.jobId = job._id;
        jobDiv.addEventListener('click', () => openJobModal(job));
        scheduler.appendChild(jobDiv);
    });

    function openJobModal(job) {
        jobDetails.innerHTML = `
            <strong>Project:</strong> ${job.project_title}<br>
            <strong>Job Site:</strong> ${job.job_site}<br>
            <strong>Assigned To:</strong> ${job.first_name} ${job.last_name}<br>
            <strong>Clock-In Time:</strong> ${job.clockin_time ? new Date(job.clockin_time).toLocaleString() : 'Not clocked in'}<br>
            <strong>Clock-Out Time:</strong> ${job.clockout_time ? new Date(job.clockout_time).toLocaleString() : 'Not clocked out'}<br>
            <strong>Total Hours:</strong> ${job.total_hours || 0}
        `;
        clockInOutBtn.innerText = job.clockedIn ? 'Clock Out' : 'Clock In';
        clockInOutBtn.onclick = async () => {
            await clockInOutJob(job._id);
            window.location.reload();
        };
        modal.classList.remove('hidden');
    }

    document.getElementById('close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});

export async function fetchJobs() {
    const response = await fetch('/api/schedule/jobs');
    return await response.json();
}

export async function clockInOutJob(jobId) {
    await fetch(`/api/schedule/jobs/${jobId}/clock`, { method: 'PATCH' });
}
document.getElementById('add-job-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jobData = {};
    formData.forEach((value, key) => {
        jobData[key] = value;
    });

    const response = await fetch('/api/schedule/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
    });

    if (response.ok) {
        alert('Job added successfully!');
        window.location.reload();
    } else {
        alert('Failed to add job.');
    }
});