
function quickFill(id, content) {
    document.getElementById(id).value = content;
}

document.getElementById('swmsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch('/swms/save', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        alert('SWMS saved successfully!');
    } else {
        alert('Error saving SWMS.');
    }
});

document.getElementById('emailSwms').addEventListener('click', async () => {
    const formData = new FormData(document.getElementById('swmsForm'));

    const response = await fetch('/swms/email', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        alert('SWMS emailed successfully!');
    } else {
        alert('Error emailing SWMS.');
    }
});
