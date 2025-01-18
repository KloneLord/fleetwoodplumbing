document.getElementById('employee_form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const auth_code = document.getElementById('auth_codeFormInput').value;

    try {
        const response = await fetch('/api/employees/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name, last_name, email, username, auth_code })
        });

        const result = await response.json();
        const formMessage = document.getElementById('formMessage');
        if (response.ok) {
            formMessage.style.color = 'green';
            formMessage.innerText = result.message;
        } else {
            formMessage.style.color = 'red';
            formMessage.innerText = result.message;
        }
    } catch (error) {
        const formMessage = document.getElementById('formMessage');
        formMessage.style.color = 'red';
        formMessage.innerText = 'An error occurred. Please try again.';
        console.error('Error adding employee:', error);
    }
});