// Generate a 16-character random alphanumeric code
export function generateAuthCode() {
    const code = [...Array(16)]
        .map(() => Math.random().toString(36)[2])
        .join('')
        .toUpperCase();

    // Save the code to the database and display it
    saveAuthCodeToDatabase(code)
        .then((response) => {
            if (response.success) {
                document.getElementById('auth_code_generate').value = code;
                alert('Authentication code generated and saved successfully!');
            } else {
                alert('Error generating code. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error saving code:', error);
            alert('An error occurred while generating the code.');
        });
}

// Validate an authentication code by checking against the database
export function validateClientAuthCode() {
    const codeInput = document.getElementById('client_auth_code_input').value;

    fetch('/api/validate-auth-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.valid) {
                alert('Code is valid!');
                // Proceed with client registration
            } else {
                alert('Invalid or expired code. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error validating code:', error);
            alert('An error occurred while validating the code.');
        });
}

// Save the generated authentication code to the database
async function saveAuthCodeToDatabase(code) {
    const response = await fetch('/api/save-auth-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });

    return await response.json();
}
