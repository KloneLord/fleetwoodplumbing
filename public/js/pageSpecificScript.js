import { generateAuthCode } from './authCodeGenerator.js';

async function handleGenerateAuthCode() {
    try {
        const authCode = await generateAuthCode('inventory_page'); // Pass the requesting page name
        document.getElementById('authCodeInput').value = authCode; // Apply to an input field or form
        alert(`Auth Code Generated: ${authCode}`);
    } catch (error) {
        console.error('Error handling auth code generation:', error.message);
    }
}

document.getElementById('generateAuthCodeButton').addEventListener('click', handleGenerateAuthCode);
